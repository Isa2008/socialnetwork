import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export function FindPeople() {
    const [people, setPeople] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(
        () => {
            axios
                .get("/findpeople")
                .then(res => {
                    setPeople(res.data);
                })
                .catch(function(error) {
                    console.log("get /findpeople error: ", error);
                });
            if (search) {
                axios
                    .get("/findsearch/" + search)
                    .then(res => {
                        setPeople(res.data);
                    })
                    .catch(function(error) {
                        console.log("get /findsearch error: ", error);
                    });
            }
        },
        [search]
    );

    const onSearch = e => {
        setSearch(e.target.value);
    };

    return (
        <div>
            <div className="wrapper">
                <h1>Find People</h1>
                <form>
                    <input
                        onChange={onSearch}
                        defaultValue={search}
                        placeholder="find new friends"
                    />
                </form>
                <div>
                    <ul>
                        {people.length &&
                            people.map(users => (
                                <div key={users.id}>
                                    <h2>
                                        {users.first} {users.last}
                                    </h2>
                                    <Link to={`/user/${users.id}`}>
                                    <img src={users.imageurl} />
                                    </Link>
                                    <h4></h4>
                                </div>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
