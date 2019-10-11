import React from "react";
import axios from "./axios";
import Profile from "./profile";
import { Profilepic } from "./profilepic";
import { Uploader } from "./uploader";
import { Route, BrowserRouter, Link } from "react-router-dom";
import { OtherProfile } from "./otherprofile";
import { FindPeople } from "./findpeople";
import Friends from "./friends";
import { Chat } from "./chat.js";

export class App extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imageurl: "",
            bio: "",
            uploaderIsVisible: false,
            showUploader: false
        };
        this.showModal = this.showModal.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.setBio = this.setBio.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(res => {
                this.setState({
                    first: res.data[0].first,
                    last: res.data[0].last,
                    imageurl: res.data[0].imageurl,
                    bio: res.data[0].bio
                });
            })
            .catch(error => {
                console.log("get /user error: ", error);
            });
    }

    showModal() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    hideModal() {
        this.setState({
            uploaderIsVisible: false
        });
    }

    uploadImage(image) {
        this.setState({
            imageurl: image,
            uploaderIsVisible: false
        });
    }

    setBio(bio) {
        this.setState({
            bio: bio
        });
    }

    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                                <h1 className="menu">The Network</h1>
                                <a className="menu" href="/logout">logout</a>
                                <Link className="menu" to="/">my profile</Link>
                                <Link className="menu" to="/friends">my friends</Link>
                                <Link className="menu" to="/users">find people</Link>
                                <Link className="menu" to="/chat">chatroom</Link>
                                <div className="picloader">
                                    <Profilepic
                                        first={this.state.first}
                                        last={this.state.last}
                                        imageurl={this.state.imageurl}
                                        showModal={this.showModal}
                                    />
                                </div>
                                <div className="uploader">
                                    {this.state.uploaderIsVisible && (
                                        <Uploader
                                            handleClick={this.handleClick}
                                            handleChange={this.handleChange}
                                            uploadImage={this.uploadImage}
                                            hideModal={this.hideModal}
                                        />
                                    )}
                                </div>
                                <Route
                                    exact
                                    path="/"
                                    render={() => (
                                        <React.Fragment>
                                <div className="wrapper">
                                    <Profile
                                        showModal={this.showModal}
                                        first={this.state.first}
                                        last={this.state.last}
                                        imageurl={this.state.imageurl}
                                        bio={this.state.bio}
                                        setBio={this.setBio}
                                    />
                                </div>
                            </React.Fragment>
                        )}
                    />
                    <Route path="/user/:id" component={OtherProfile} />
                    <Route
                        path="/users"
                        render={props => (
                            <FindPeople
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route path="/friends" component={Friends} />
                    <Route path="/chat" component={Chat} />
                </React.Fragment>
            </BrowserRouter>
        );
    }
}
