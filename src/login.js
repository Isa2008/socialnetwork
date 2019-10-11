import React from "react";
import axios from "./axios";
import { HashRouter } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: false };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log("this.state: ", this.state)
        );
    }

    handleLogin(e) {
        e.preventDefault();
        axios
            .post("/login", this.state)
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
                console.log("post /login error: ", error);
            });
    }

    render() {
        return (
            <HashRouter>
                <div className="intro">
                    <h1>Login</h1>
                    {this.state.error && <h2>Please try again</h2>}
                    <form className="register">
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
                        <button onClick={this.handleLogin} name="login">
                            Login
                        </button>
                    </form>
                </div>
            </HashRouter>
        );
    }
}
