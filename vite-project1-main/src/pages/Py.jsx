import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import IDE from "../components/IDE.jsx";
import './home.css';
import NavBar from "../components/NavBar.jsx";

const Py = () => {

    const [codes, setCodes] = useState([])
    const fetchCodes = () => axios.get(`http://localhost:3001/Python`).then(srces => setCodes(srces.data));

   

    useEffect(() => {
        window.addEventListener("scroll", () => {
            let current = "";
            document.querySelectorAll("div.sec").forEach((div) => {
                let sectionTop = div.offsetTop;
                if (window.scrollY >= sectionTop - 65) {
                    current = div.getAttribute("id");
                }
            });
            document.querySelectorAll("nav ul li a").forEach((li) => {
                li.classList.remove("active");
                document.querySelector(`nav ul li a[href*=${current}]`).classList.add("active");
            });
        });
        fetchCodes();
    }, []);

    console.log(`http://${window.location.host}`);

    return (
        <body className="pbody">
        <div className="box">
            < NavBar />
            <div className="content">
                <main>
                    {codes.map((item, i) => (
                        <div className="sec" id={`ide-${item.filename}`} key={i}>
                            <h4>{item.title}</h4>
                            <IDE item={item} />
                        </div>
                    ))}
                </main>

            </div>
           
        </div>
        </body>
    );
};

export default Py;
