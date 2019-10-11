import axios from "./axios";

export function getAllFriends() {
    return axios.get("/friends/:get-all-friends.json")
        .then(({data}) => {
          return {
              type: "GET_ALL_FRIENDS",
              allFriends: data
          };
    })
}

export function endFriendship(idEndFriend) {
    return axios.post("/unfriend/" + idEndFriend)
        .then(({data}) => {
            return {
                type: "END_FRIENDSHIP",
                endFriendship: idEndFriend
            };
        });
}

export function acceptFriendship(idAcceptFriend) {
    return axios.post("/acceptfriend/" + idAcceptFriend)
        .then(({data}) => {
            return {
                type: "ACCEPT_FRIENDSHIP",
                acceptFriendship: idAcceptFriend
            };
        });
}

export function chatMessages(idChatMessages) {
    return {
        type: "GET_MESSAGES",
        chatMessages: idChatMessages
    };
}

export function addChatMessage(msg) {
    return {
        type: "ADD_MESSAGE",
        chatMessages: msg
    };
}
