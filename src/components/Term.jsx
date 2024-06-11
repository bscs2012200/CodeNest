import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import * as fit from "xterm/lib/addons/fit/fit";
import "xterm/dist/xterm.css";
import axios from "axios";

const Term = ({ cols, rows, filename, execute }) => {
    const terminalRef = useRef();
    const [pid, setPid] = useState(() => sessionStorage.getItem("pid") || -1);
    const [termSocket, setTermSocket] = useState(null);

    useEffect(() => {
        const terminal = new Terminal({
            cols,
            rows,
            cursorBlink: true,
            theme: {
                background: "#f5f5f5",
                foreground: "#000000",
                cursor: "#000000"
            },
        });

        Terminal.applyAddon(fit);

        const fetchTerminal = async () => {
            try {
                const response = await fetch(`http://localhost:3001/terminals?cols=${cols}&rows=${rows}&src=${filename}`, {
                    method: "POST",
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch terminal');
                }

                const pid = await response.text();
                setPid(pid);
                sessionStorage.setItem("pid", pid);
                const socket = new WebSocket(`ws://localhost:3001/terminals/${pid}`);
                
                terminal.loadAddon(new AttachAddon(socket));
                setTermSocket(socket);
                terminal.open(terminalRef.current);
            } catch (error) {
                console.error('Error fetching terminal:', error);
            }
        };

        fetchTerminal();

        return () => {
            if (termSocket) {
                termSocket.close();
            }
            terminal.dispose();
        };
    }, [cols, rows, filename, execute]);

    return <div ref={terminalRef} id="terminal-container" />;
};

export default Term;
