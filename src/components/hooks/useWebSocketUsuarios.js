import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const API_URL = process.env.REACT_APP_API_URL;

export const useWebSocketUsuarios = (onUpdate) => {
    useEffect(() => {
        const socket = new SockJS(API_URL+'/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe("/topic/usuarios", () => {
                    onUpdate();
                });
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [onUpdate]);
};
