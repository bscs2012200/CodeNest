import React, { useEffect, useState } from "react";
import axios from "axios";
import IDES from "../components/IDES.jsx";

const OpenIDE = () => {
  const [codes, setCodes] = useState([]);

  const fetchCodes = () => axios.get(`http://localhost:3001/codes`).then(srces => setCodes(srces.data));

  useEffect(() => {
    fetchCodes();
  }, []);

  
  const specificCode = codes.find(item => item.filename === "src-5");

  return (
    <div className="box">
      <div className="content">
        <main>
          {specificCode && (
            <div className="sec" id={`ide-${specificCode.filename}`}>
              <h4>{specificCode.title}</h4>
              <IDES item={specificCode} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OpenIDE;
