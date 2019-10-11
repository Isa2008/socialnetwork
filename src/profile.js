import React from "react";
import { Bioeditor } from "./bioeditor";
import { Profilepic } from "./profilepic";
import { Route } from "react-router-dom";

export default function Profile({ first, last, imageurl, bio, setBio, showModal }) {
    return (
        <div id="profile">
            <h1>
                {first} {last}
            </h1>
            <Profilepic
                first={first}
                last={last}
                imageurl={imageurl}
                showModal={showModal}
                size="xl"
            />
            <Bioeditor bio={bio} setBio={setBio} />
        </div>
    );
}
