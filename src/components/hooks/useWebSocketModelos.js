import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const API_URL = process.env.REACT_APP_API_URL;

export const useWebSocketModelos = (onUpdate) => {
    useEffect(() => {
        const socket = new SockJS(API_URL+'/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe("/topic/modelos", (message) => {
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

