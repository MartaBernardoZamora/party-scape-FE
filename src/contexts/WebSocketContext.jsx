import { createContext, useContext, useRef } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    const connect = (matchId, onMessage) => {
        if (
          socketRef.current &&
          (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)
        ) {
          console.log("♻️ Cerrando WebSocket anterior");
          socketRef.current.close();
        }
      
        const socket = new WebSocket(`ws://localhost:8080/api/v1/ws-matches?match=${matchId}`);
        socketRef.current = socket;
      
        socket.onopen = () => {
          console.log("✅ WebSocket conectado");
        };
      
        socket.onmessage = (event) => {
          console.log("📨 Mensaje recibido bruto:", event.data);
          const data = JSON.parse(event.data);
          if (onMessage) onMessage(data);
        };
      
        socket.onerror = (e) => console.error("❌ WebSocket error:", e);
      
        socket.onclose = () => {
          console.log("🔌 WebSocket cerrado");
        };
      
        return socket;
      };

    const send = (message) => {
        const socket = socketRef.current;
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.warn("⚠️ WebSocket no está listo para enviar");
        }
    };

    const close = () => {
        const socket = socketRef.current;
        if (!socket) return;
      
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          console.log("⛔ Cerrando WebSocket");
          socket.close();
        } else {
          console.log("🟡 WebSocket ya cerrado o en cierre");
        }
      };

    return (
        <WebSocketContext.Provider value={{ connect, send, close }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
