import * as io from "socket.io-client";
import { chatMessages, addChatMessage } from './actions';

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();
        socket.on(
            'message from server', (msg) => {
              store.dispatch(addChatMessage(msg));
            }
        );
        socket.on(
            'getLastTenChatMessages',
            msgs => store.dispatch(
                chatMessages(msgs)
            )
        );
    }
};
