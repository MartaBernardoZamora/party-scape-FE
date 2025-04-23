let socket;

function MatchWebSocket(matchId, onMessage) {
  socket = new WebSocket(`ws://localhost:8080/api/v1/ws-matches?match=${matchId}`);

  socket.onopen = () => console.log("WebSocket conectado");
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (onMessage) onMessage(data);
  };
  socket.onerror = (e) => console.error("WebSocket error:", e);
  socket.onclose = () => console.log("🔌 WebSocket cerrado");

  return socket;
}

export default MatchWebSocket;