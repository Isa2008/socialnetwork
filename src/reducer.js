export default function reducer(state = {}, action) {
    if (action.type === "GET_ALL_FRIENDS") {
        state = {
            ...state,
            allFriends: action.allFriends
        };
    }
    if (action.type === "END_FRIENDSHIP") {
        state = {
            ...state,
            allFriends: state.allFriends.filter(
              user => user.id != action.endFriendship
            )
        };
    }
    if (action.type === "ACCEPT_FRIENDSHIP") {
        state = {
            ...state,
            allFriends: state.allFriends.map(user => {
                if (user.id == action.acceptFriendship) {
                    return {
                        ...user,
                        accepted: true
                    };
                } else {
                    return {
                        ...user
                    };
                }
            })
        }
    }
    if (action.type === "GET_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }
    if (action.type === "ADD_MESSAGE") {
        state =  {
            ...state,
            chatMessages: [...state.chatMessages, action.chatMessages]
        };
    }
    return state;
}
