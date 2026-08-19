const { WebSocketServer } = require('ws');

const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ port });

let clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (data, isBinary) => {
    // Broadcast binary WebAssembly network packets to all other connected clients
    for (const client of clients) {
      if (client !== ws && client.readyState === 1) {
        client.send(data, { binary: isBinary });
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

console.log(`WebSocket relay server running on port ${port}`);
