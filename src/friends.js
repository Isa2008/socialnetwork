import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFriends, acceptFriendship, endFriendship } from "./actions";
import { Profilepic } from "./profilepic";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();
    const allFriends = useSelector(
        state =>
            state.allFriends &&
            state.allFriends.filter(user => user.accepted === true)
        );
    const pending = useSelector(
        state =>
            state.allFriends &&
            state.allFriends.filter(user => user.accepted === false)
    );

    useEffect(() => {
        dispatch(getAllFriends());
    }, []);

    const handleClickOnAllFriends = idEndFriend => {
      dispatch(endFriendship(idEndFriend));
    };

    const handleClickOnPending = idAcceptFriend => {
        dispatch(acceptFriendship(idAcceptFriend));
    };


    return (
        <div className="friendsromm">
            <div className="friends">
                <h1>Friends</h1>
                    {allFriends &&
                        allFriends.map(users => (
                            <div className="friends" key={users.id}>
                                <h2>{users.first} {users.last}</h2>
                                <Link to={`/user/${users.id}`}>
                                <Profilepic imageurl={users.imageurl} />
                                </Link>
                                <button onClick={() => handleClickOnAllFriends(users.id)}>Unfriend
                                </button>
                            </div>
                    ))}
            </div>
            <div className="friends">
                <h1>Wannabes</h1>
                {pending &&
                pending.map(users => (
                    <div key={users.id}>
                        <h2>{users.first} {users.last}</h2>
                            <div className={`friends-pics`}>
                                <Link to={`/user/${users.id}`}>
                                <Profilepic imageurl={users.imageurl} />
                                </Link>
                            </div>
                            <button onClick={() => handleClickOnPending(users.id)}>Accept Friend
                            </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
