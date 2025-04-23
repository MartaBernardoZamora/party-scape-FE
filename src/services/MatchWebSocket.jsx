let socket;

function MatchWebSocket(onMessage) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket("ws://localhost:8080/api/v1/ws-matches");

    socket.onopen = () => {
      console.log("WebSocket conectado");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (onMessage) onMessage(data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket cerrado");
    };
  }

  return socket;
}

export default MatchWebSocket;