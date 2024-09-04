import React, { useEffect, useState } from "react";
import axios from "axios";
import IDE from "./IDE.jsx";
import './Liveide.css';
import Sidebar2 from "./sidebar2.jsx";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Assuming you're using react-icons for the arrows

const LiveIDE = () => {
    const [codes, setCodes] = useState([]);
    const [expandedSections, setExpandedSections] = useState({}); // Track expanded state

    const fetchCodes = () => axios.get(`http://localhost:3001/codes`).then(response => setCodes(response.data));

    useEffect(() => {
        const handleScroll = () => {
            let currentSection = "";
            document.querySelectorAll(".section").forEach((section) => {
                let sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 65) {
                    currentSection = section.getAttribute("id");
                }
            });
            document.querySelectorAll(".navbar-link").forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href").includes(currentSection)) {
                    link.classList.add("active");
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        fetchCodes();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleSection = (id) => {
        setExpandedSections(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <div className="live-ide-container">
            <Sidebar2 />
            <div className="content-wrapper">
            <div className="welcome-section">
                <h1>Welcome to the Live IDE</h1>
                <p className="info-text">You have 4 templates to practice with.</p>
            </div>
                <main className="ide-main">
                    {codes.map((item, index) => (
                        <div className="section" id={`ide-${item.filename}`} key={index}>
                            <div className="section-header" onClick={() => toggleSection(item.filename)}>
                                <h4 className="section-title">{item.title}</h4>
                                {expandedSections[item.filename] ? 
                                    <FaChevronUp className="toggle-icon" /> :
                                    <FaChevronDown className="toggle-icon" />}
                            </div>
                            {expandedSections[item.filename] && <IDE item={item} />}
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
};

export default LiveIDE;
