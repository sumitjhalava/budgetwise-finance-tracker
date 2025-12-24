const WebSocket = require('ws');
const port = process.env.PORT || 8083;

const wss = new WebSocket.Server({ port }, () => {
  console.log(`WebSocket test server running on ws://localhost:${port}`);
});

// Simple protocol: broadcast received JSON messages to all clients
wss.on('connection', function connection(ws) {
  console.log('Client connected');
  ws.send(JSON.stringify({ text: 'Welcome to BudgetWise forum test server', at: new Date().toISOString(), user: 'Server' }));

  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message.toString());
      // attach server timestamp
      const payload = { ...data, serverAt: new Date().toISOString() };
      // broadcast to all clients
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(payload));
        }
      });
    } catch (e) {
      // echo non-json
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message.toString());
        }
      });
    }
  });

  ws.on('close', () => console.log('Client disconnected'));
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down ws server');
  wss.close(() => process.exit(0));
});
