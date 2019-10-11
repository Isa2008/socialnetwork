import React from "react";

export function Profilepic({ imageurl, first, last, showModal }) {
    imageurl = imageurl || "/default.png";
    return (
        <div className={`profilesmall`}>
            <img onClick={showModal} src={imageurl} />
        </div>
    );
}
