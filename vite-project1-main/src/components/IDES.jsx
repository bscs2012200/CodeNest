import React, { Fragment, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Term from "./Term.jsx";
import axios from "axios";

const IDES = ({ language, item, filename, extension, testId, regno, questionId,name}) => {
    const editorRef = useRef(null);
    const [execute, setExecute] = useState(0);
    const [saveStatus, setSaveStatus] = useState(null);
    const [saveDate, setsaveDate] = useState(getCurrentDate());
    function handleEditorDidMount(editor, monaco) {
        editor.getModel().updateOptions({ tabSize: 4 });
        editor.getAction("editor.action.formatDocument").run();
        editorRef.current = editor;
    }

    function getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');
    
        return `${day}-${month}-${year}`;
    }
    
     // Output: YYYY-MM-DD
    

    function showValue() {
        console.log(editorRef.current.getValue());
        console.log(filename);
        console.log(testId);
        console.log(regno);
        console.log(questionId);
        console.log(language);
        console.log(name);
        console.log(saveDate);


        setExecute(0);
        axios.post("http://localhost:3001/savet", {
            src: editorRef.current.getValue(),
            extension: extension,
            filename: filename,
            language: language // Changed from item.language to language
        })
        .then((res) => {
            if (res.data === "saved") {
                setExecute(1);
            }
        });
        axios.post("http://localhost:3001/terminals", {
            src: editorRef.current.getValue(),
            extension: extension,
            filename: filename,
            language: language,
        })
        .then((res) => {
            if (res.data === "saved") {
                console.log("Finish")
            }
        });
    }

    function saveans(){
        axios.post("http://localhost:3001/testattempt", {
            regno: regno,
            src: editorRef.current.getValue(),
            extension: extension,
            filename: filename,
            language: language,
            testId: testId,
            questionId: questionId,
            name: name,
            date: saveDate
        })
        .then((res) => {
            // Log response to check if it's returning "saved" or "updated"
            console.log("Save Response:", res.data);
            
            // Set save status based on response
            const status = (res.data === "saved" || res.data === "updated") ? "success" : "danger";
            console.log("Save Status:", status);
            setSaveStatus(status);
        })
        .catch((error) => {
            console.error("Error saving code:", error);
            setSaveStatus("danger");
        });
    }
    
    function handlechange(){
        saveans();
    }

    return (
        <Fragment>
            <div className="card">
                <div className="tools">
                    <div className="circle">
                        <span className="red box"></span>
                    </div>
                    <div className="circle">
                        <span className="yellow box"></span>
                    </div>
                    <div className="circle">
                        <span className="green box"></span>
                    </div>
                    <div style={{ marginLeft: '85%' }} className="circle">
                    <button type="button" onClick={showValue} className="btn btn-primary" >
                      Run <p class="fa fa-play"></p>  
                    </button>
        
                    </div>
                </div>
                <div className="card__content">
                    <Editor
                        height={200}
                        onMount={handleEditorDidMount}
                        language={language} 
                        value={item.src}
                        scrollBeyondLastLine="false"
                        onChange={handlechange}
                        options={{
                            readOnly: false,
                            minimap: { enabled: false },
                            scrollbars: false,
                        }}
                    />
                     Output:
            <div style={{ height: 200, backgroundColor: "#f5f5f5", border: '1px solid black', position:'relative' }}>
                {execute !== 0 ? <Term cols={100} rows={11} filename={filename} execute={execute} /> : null}
            </div>
                </div>
                {/* {saveStatus && (
                    <div className={`alert alert-${saveStatus}`} role="alert">
                        {saveStatus === "success" ? "Code successfully saved" : "Error saving code"}
                    </div>
                )} */}
                
            </div>
           
        </Fragment>
    );
};

export default IDES;