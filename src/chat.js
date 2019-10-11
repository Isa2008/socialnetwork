import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Profilepic } from "./profilepic";
import { Link } from "react-router-dom";

export function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);

    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("My amazing chat message", e.target.value);
            e.target.value = "";
        }
    };

    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    return (
        <div className="wrapper">
            <h1>Chat Room</h1>
            <div className="chatroom">
                <div className="chat-messages" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((users, index) => (
                            <div className="chatbox" key={index}>
                                <Profilepic imageurl={users.imageurl} />
                                <em>
                                    {users.first} {users.last}:
                                </em>
                                <span id="message">{users.message}</span>
                            </div>
                        ))}
                </div>
                <textarea
                    id="chatfield"
                    placeholder="write something nice"
                    onKeyDown={keyCheck}
                />
            </div>
        </div>
    );
}
