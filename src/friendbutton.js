import React, { useState, useEffect } from "react";
import axios from "./axios";

export function FriendButton({ friendId }) {
    const [friendbutton, setFriendbutton] = useState([]);

    useEffect(() => {
        axios
            .get("/relation/" + friendId)
            .then(res => {
                setFriendbutton(res.data);
            })
            .catch(function(error) {
                console.log("get /relation error: ", error);
            });
    }, []);

    const funObj = {
        makefriend: function(e) {
            e.preventDefault();
            axios.post("/makefriend/" + friendId).then(res => {
                setFriendbutton(res.data);
            });
        },

        cancelfriend: function(e) {
            e.preventDefault();
            axios.post("/cancelfriend/" + friendId).then(res => {
                setFriendbutton(res.data);
            });
        },

        acceptfriend: function(e) {
            e.preventDefault();
            axios.post("/acceptfriend/" + friendId).then(res => {
                setFriendbutton(res.data);
            });
        },

        unfriend: function(e) {
            e.preventDefault();
            axios.post("/unfriend/" + friendId).then(res => {
                setFriendbutton(res.data);
            });
        }
    };

    return (
        <div>
            {friendbutton &&
                friendbutton.map(friendship => (
                    <button
                        key={friendship.text}
                        onClick={funObj[friendship.fun]}
                    >
                        {friendship.text}
                    </button>
                ))}
        </div>
    );
}
