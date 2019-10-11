import React from "react";
import Register from "./register";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <HashRouter>
                <div>
                    <h1 className="network">The Network</h1>
                    <div className="forms">
                        <Route exact path="/" component={Register} />
                        <Route path="/login" component={Login} />
                    </div>
                </div>
            </HashRouter>
        );
    }
}
