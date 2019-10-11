import React from "react";
import axios from "./axios";
import { HashRouter, Link } from "react-router-dom";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: false };
        this.handleChange = this.handleChange.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
    }
    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log("this.state: ", this.state)
        );
    }

    handleRegistration(e) {
        e.preventDefault();
        axios
            .post("/register", this.state)
            .then(res => {
                if (res.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(error => {
                console.log("post /register error: ", error);
            });
    }

    render() {
        return (
            <HashRouter>
                <div className="intro">
                    <h1>We are designers, artists, writers, producers, makers, lovers. We are world citizens. We are you.</h1>
                    <h2>Join us now!</h2>
                    {this.state.error && <h2>Please try again</h2>}
                    <form className="register">
                        <input
                            name="first"
                            type="text"
                            placeholder="first"
                            onChange={this.handleChange}
                        />
                        <input
                            name="last"
                            type="text"
                            placeholder="last"
                            onChange={this.handleChange}
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="email"
                            onChange={this.handleChange}
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="password"
                            autoComplete="off"
                            onChange={this.handleChange}
                        />
                        <button className="btn-register"
                            onClick={this.handleRegistration}
                            name="registration"
                        >
                            Register
                        </button>
                        <h2>
                            Or <Link to="/login">Login</Link>
                        </h2>
                    </form>
                </div>
            </HashRouter>
        );
    }
}
