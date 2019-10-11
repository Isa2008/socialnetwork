import React from "react";
import axios from "./axios";

export class Bioeditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            showBiotext: false
        };
        this.showAddBioEditor = this.showAddBioEditor.bind(this);
        this.handleChangeBio = this.handleChangeBio.bind(this);
        this.handleClickSave = this.handleClickSave.bind(this);
        this.handleChangeAdd = this.handleChangeAdd.bind(this);
        this.handleClickAdd = this.handleClickAdd.bind(this);
    }

    handleChangeBio(e) {
        this.setState({
            bio: e.target.value
        });
    }

    handleClickSave() {
        this.setState({
            showBiotext: false
        });
        axios
            .post("/bio", this.state)
            .then(res => {
                this.props.setBio(res.data.bio);
                if (res.data.success) {
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(function(error) {
                console.log("post /bio error: ", error);
            });
    }

    handleChangeAdd() {
        this.setState();
    }

    handleClickAdd() {}

    showAddBioEditor() {
        this.setState({
            showBiotext: true,
            bio: this.props.bio
        });
    }

    render() {
        let elem = (
            <div>
                <button>EDIT</button>
            </div>
        );

        let buttonText;
        if (!this.props.bio) {
            buttonText = "ADD BIO";
        } else {
            buttonText = "EDIT BIO";
        }
        if (this.state.showBiotext) {
            elem = (
                <div>
                    <textarea
                        onChange={this.handleChangeBio}
                        v-model="bio"
                        type="text"
                        id="bio"
                        placeholder="write something about yourself"
                        defaultValue={
                            this.state.bio ? this.state.bio : this.props.bio
                        }
                    />
                    <button onClick={this.handleClickSave}> SAVE BIO</button>
                </div>
            );
        } else {
            elem = (
                <div>
                    {this.props.bio}
                    <button onClick={this.showAddBioEditor}>
                        {buttonText}
                    </button>
                    <label onChange={this.handleChangeAdd} />
                </div>
            );
        }
        return elem;
    }
}
