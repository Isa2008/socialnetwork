import React from "react";
import axios from "./axios";

export class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        this.file = e.target.files[0];
    }

    handleClick() {
        var formData = new FormData();
        formData.append("file", this.file);

        axios
            .post("/upload", formData)
            .then(res => {
                this.props.uploadImage(res.data.rows[0].imageurl);
            })
            .catch(function(error) {
                console.log(
                    "post /upload error: ",
                    error
                );
            });
    }

    render() {
        return (
            <div>
                <div>
                    <input
                        onChange={this.handleChange}
                        htmlFor="file"
                        type="file"
                        name="file"
                        accept="image/*"
                        className="choose"
                    />
                    <button onClick={this.handleClick} className="update">
                        UPDATE
                    </button>
                    <p className="x-close" onClick={this.props.hideModal}>
                        X
                    </p>
                </div>
            </div>
        );
    }
}
