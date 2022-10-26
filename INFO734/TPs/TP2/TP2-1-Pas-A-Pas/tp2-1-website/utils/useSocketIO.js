import {useEffect, useState} from 'react';
import SocketIOClient from "socket.io-client";

/**
 * Le hook pour utiliser SocketIO et montrer un message à tous les utilisateurs si un administrateur le souhaite
 */
const useSocketIO = () => {

    /**
     * Le message à montrer
     */
    const [message, setMessage] = useState(undefined);

    /**
     * La socket de SocketIO
     * The socket from socket io
     */
    const [socketIO, setSocketIO] = useState(undefined);

    /**
     * Quand on reçoit un message à montrer, on veut changer l'état de la variable message, en "monitorant" cette variable dans un useEffect on pourra savoir quand elle a été modifiée et ainsi montrer le message
     * @param messageReceived Le message reçu
     */
    const onNewMessageReceived = (messageReceived) => {
        setMessage(JSON.stringify(messageReceived));
    }

    // Le useEffect pour initialiser la socket de SocketIO
    useEffect(() => {
        // Connect to socket server
        const socket = SocketIOClient(`/`);
        setSocketIO(socket);

        // Quand on reçoit un message de la part de la websocket, on veut exécuter la fonction onNewMessageReceived
        socket.on("message_recu", onNewMessageReceived);

        // On utilise cette syntax pour libérer le mémoire et fermer la Socket correctement
        return () => {
            // Close the connection
            if (socketIO !== undefined) {
                socketIO.close();
            }
        };
    }, []); // Mettre une liste vide comme dépendance permet d'utiliser le useEffect une seule fois


    // Return le message sous forme d'état qui se mettra à jour si un nouveau message est reçu
    return message;
}

export default useSocketIO;