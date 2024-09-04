import React, { Fragment, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Term from "./Term.jsx";
import axios from "axios";

const IDEA = ({ language, item, filename, extension, testId, regno, questionId, src }) => {
    const editorRef = useRef(null);
    const [execute, setExecute] = useState(0);
    
    function handleEditorDidMount(editor, monaco) {
        editor.getModel().updateOptions({ tabSize: 4 });
        editor.getAction("editor.action.formatDocument").run();
        editorRef.current = editor;
    }

    function showValue() {
        console.log(editorRef.current.getValue());
        console.log(filename);
        console.log(testId);
        console.log(regno);
        console.log(questionId);
        console.log(language);
        setExecute(0);
        axios.post("http://localhost:3001/savet", {
            src: src,
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
            src: src,
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

    return src ? (
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
                      Run <p className="fa fa-play"></p>  
                    </button>
        
                    </div>
                </div>
                <div className="card__content">
                    <Editor
                        height={200}
                        onMount={handleEditorDidMount}
                        language={language} 
                        value={src} 
                        scrollBeyondLastLine="false"
                        options={{
                            readOnly: true, // Set readOnly to true
                            minimap: { enabled: false },
                            scrollbars: false,
                        }}
                    />
                     Output:
            <div style={{ height: 200, backgroundColor: "#f5f5f5", border: '1px solid black', position:'relative' }}>
                {execute !== 0 ? <Term cols={100} rows={11} filename={filename} execute={execute} /> : null}
            </div>
                </div>
              
                
            </div>
           
        </Fragment>
    ) : null;
};

export default IDEA;
