import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Forum.css";

// Simple placeholder WebSocket URL — local dev server uses port 8083 (see tools/ws-test-server)
const WS_URL = (typeof window !== 'undefined' && window.location.hostname === 'localhost') ? 'ws://localhost:8083' : 'wss://example.com/ws/forum';

function initials(name) {
  if (!name) return 'U';
  return name.split(' ').map((s) => s[0]).slice(0,2).join('').toUpperCase();
}

function timeAgo(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function Forum() {
  const storedUser = JSON.parse(localStorage.getItem('bw_currentUser') || '{}');
  const defaultName = storedUser?.name || 'Anonymous';

  const [messages, setMessages] = useState([
    // seed some friendly example posts to make the forum look alive
    { id: 1, user: 'Alice', text: 'Welcome! Share your best budgeting tips — how do you track groceries?', at: new Date(Date.now()-1000*60*60*24).toISOString(), likes: 3 },
    { id: 2, user: 'Bob', text: 'I use category budgets and weekly reviews. Helps a lot.', at: new Date(Date.now()-1000*60*60*20).toISOString(), likes: 2 },
  ]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState(defaultName);
  const wsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('bw_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        setMessages((m) => [...m, { id: Date.now() + Math.random(), ...data }]);
      } catch (e) {
        setMessages((m) => [...m, { id: Date.now() + Math.random(), text: String(ev.data), user: 'Remote' }]);
      }
    };

    return () => { ws.close(); };
  }, [navigate]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const payload = { text: input.trim(), at: new Date().toISOString(), user: name };
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
    // always add locally for instant feedback
    setMessages((m) => [...m, { id: Date.now() + Math.random(), ...payload, self: true }]);
    setInput("");
  };

  const toggleLike = (id) => {
    setMessages((m) => m.map(msg => msg.id === id ? { ...msg, likes: (msg.likes||0) + 1 } : msg));
  };

  return (
    <div className="forum-page">
      <header className="forum-header">
        <div className="title-wrap">
          <h1>Financial Tips Forum</h1>
          <p className="subtitle">Ask questions, share strategies, and learn from others managing personal finances.</p>
        </div>
        <div className={`forum-status ${connected ? 'online' : 'offline'}`}>{connected ? 'Online' : 'Offline'}</div>
      </header>

      <div className="forum-grid">
        <aside className="forum-sidebar">
          <div className="forum-card topics">
            <h3>Topics</h3>
            <ul>
              <li>Budgeting & Tracking <span className="count">24</span></li>
              <li>Savings & Emergency Fund <span className="count">18</span></li>
              <li>Investing Basics <span className="count">12</span></li>
              <li>Taxes & Compliance <span className="count">6</span></li>
              <li>Tools & Automation <span className="count">9</span></li>
            </ul>
          </div>

          <div className="forum-card quick-profile">
            <h3>Your Profile</h3>
            <div className="profile-row">
              <div className="avatar small">{initials(name)}</div>
              <div>
                <div className="pname">{name}</div>
                <input className="name-edit" value={name} onChange={(e)=>setName(e.target.value)} />
              </div>
            </div>
            <p className="small muted">Set your display name for the forum. This is local only.</p>
          </div>
        </aside>

        <main className="forum-main">
          <div className="forum-chat-card">
            <div className="messages">
              {messages.length === 0 && <div className="empty">No messages — start the conversation 👋</div>}

              {messages.map((m) => (
                <article key={m.id} className={`post ${m.self ? 'self' : 'other'}`}>
                  <div className="avatar">{initials(m.user)}</div>
                  <div className="post-body">
                    <div className="post-meta">
                      <strong className="username">{m.user || 'User'}</strong>
                      <span className="dot">•</span>
                      <span className="time">{timeAgo(m.at)}</span>
                    </div>
                    <div className="post-text">{m.text}</div>
                    <div className="post-actions">
                      <button className="action" onClick={() => toggleLike(m.id)}>👍 {m.likes || 0}</button>
                      <button className="action">💬 Reply</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="chat-input">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Share a tip or ask a question..." />
              <button onClick={sendMessage} className="send-btn">Send</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
