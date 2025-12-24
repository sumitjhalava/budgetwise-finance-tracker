# BudgetWise WebSocket Test Server

This is a tiny WebSocket server for local testing of the Forum chat UI.

Prerequisites
- Node.js (14+ recommended)

Install and run

```bash
cd tools/ws-test-server
npm install
npm start
```

The server listens on `ws://localhost:8083` by default. It broadcasts any JSON message received to all connected clients.

Usage
- Start the server before opening the Forum page in the frontend.
- Forum page will connect to `ws://localhost:8083` and display messages.

Notes
- This is a test server only — it does not persist messages.
- Replace with a production-grade backend when ready.
