import React, { Fragment, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Term from "./Term.jsx";
import axios from "axios";


const IDE = ({ item }) => {
    const editorRef = useRef(null);
    const [execute, setExecute] = useState(0);



    function handleEditorDidMount(editor, monaco) {
        editor.getModel().updateOptions({ tabSize: 4 });
        editor.getAction("editor.action.formatDocument").run();
        editorRef.current = editor;
    }

    function showValue() {
        console.log(editorRef.current.getValue());
        console.log(item.filename);
        console.log("ID:", item._id); // Adding this line
        setExecute(0);
        axios
            .post("http://localhost:3001/save", {
                src: editorRef.current.getValue(),
                extension: item.extension,
                filename: item.filename,
                _id: item._id,
                language : item.language
            })
            .then((res) => {
                if (res.data === "saved") {
                    setExecute(1);
                }
            });
            axios
            .post("http://localhost:3001/terminals", {
                src: editorRef.current.getValue(),
                extension: item.extension,
                filename: item.filename,
                _id: item._id,
                language : item.language,
                
            });
    }


    return (
        
        <Fragment>
              
            <Editor
               
                height={300}
                onMount={handleEditorDidMount}
                language={item.language}
                value={item.src}
                scrollBeyondLastLine="false"
                options={{
                    readOnly: false,
                    minimap: { enabled: false },
                    scrollbars: false,
                    
                    
                }}
            />
          <button type="button" onClick={showValue} className="btn btn-primary">
                Compile
                
            </button>
            output:
            <div style={{ width: 1162, height: 200, backgroundColor: "#f5f5f5" }}>
                {execute !== 0 ? <Term cols={132} rows={11} filename={item.filename} execute={execute} /> : null}
            </div>
        </Fragment>
    );
};
export default IDE;
