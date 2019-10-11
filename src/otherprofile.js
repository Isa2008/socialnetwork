import React from "react";
import axios from "./axios";
import { FriendButton } from "./friendbutton";
import { Link } from "react-router-dom";
import { Profilepic } from "./profilepic";
import { Uploader } from "./uploader";

export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios
            .get("/users/" + id)
            .then(res => {
                this.setState({
                    first: res.data[0].first,
                    last: res.data[0].last,
                    bio: res.data[0].bio,
                    imageurl: res.data[0].imageurl
                });
                if (res.data.length != 0) {
                    this.setState.first;
                    this.setState.last;
                    this.setState.bio;
                    this.setState.imageurl;
                } else {
                    this.props.history.push("/");
                }
            })
            .catch(function(error) {
                console.log("get /users + id error: ", error);
            });
    }

    render() {
        return (
            <div>
                <div className="wrapper">
                    <h1>Do you know?</h1>
                    <h2>
                        {this.state.first} {this.state.last}
                    </h2>
                    <p>{this.state.bio}</p>
                    <img src={this.state.imageurl} />
                    <FriendButton friendId={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}
