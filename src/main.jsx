import { useState, useRef, useEffect } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --border: #2a2a3a;
    --accent: #7c6af7;
    --accent2: #f06a9e;
    --text: #e8e8f0;
    --muted: #6060a0;
    --green: #4df0b4;
    --font-mono: 'Space Mono', monospace;
    --font-display: 'Syne', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-mono);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .grid-bg {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(124,106,247,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,106,247,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .glow-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }
  .glow-orb.a { width: 400px; height: 400px; top: -100px; left: -100px; background: rgba(124,106,247,0.15); }
  .glow-orb.b { width: 300px; height: 300px; bottom: -80px; right: -80px; background: rgba(240,106,158,0.12); }

  .shell {
    position: relative; z-index: 1;
    width: 100%; max-width: 700px;
    height: 100vh; max-height: 760px;
    display: flex; flex-direction: column;
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    background: var(--surface);
    box-shadow: 0 0 0 1px rgba(124,106,247,0.1), 0 40px 80px rgba(0,0,0,0.6);
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--surface2);
    flex-shrink: 0;
  }

  .dots { display: flex; gap: 7px; }
  .dot {
    width: 12px; height: 12px; border-radius: 50%;
    cursor: pointer; transition: opacity 0.2s;
  }
  .dot:hover { opacity: 0.7; }
  .dot.red   { background: #ff5f57; }
  .dot.amber { background: #febc2e; }
  .dot.green { background: #28c840; }

  .title-area { display: flex; align-items: center; gap: 10px; }
  .title-area h1 {
    font-family: var(--font-display);
    font-size: 15px; font-weight: 800;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--text);
  }

  .status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px var(--green);
    animation: pulse 2s ease infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }

  .model-badge {
    font-size: 10px; color: var(--muted);
    border: 1px solid var(--border);
    padding: 3px 8px; border-radius: 20px;
    letter-spacing: 0.06em;
  }

  .messages {
    flex: 1; overflow-y: auto; padding: 24px 20px;
    display: flex; flex-direction: column; gap: 20px;
    scroll-behavior: smooth;
  }

  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-track { background: transparent; }
  .messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .msg {
    display: flex; gap: 12px;
    animation: msgIn 0.25s ease both;
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .msg.user { flex-direction: row-reverse; }

  .avatar {
    width: 34px; height: 34px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
    font-weight: 700;
  }
  .avatar.bot { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; font-family: var(--font-display); }
  .avatar.user { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); }

  .bubble {
    max-width: 78%;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 13.5px; line-height: 1.65;
    letter-spacing: 0.01em;
  }

  .msg.bot .bubble {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    border-top-left-radius: 3px;
  }

  .msg.user .bubble {
    background: linear-gradient(135deg, rgba(124,106,247,0.25), rgba(240,106,158,0.15));
    border: 1px solid rgba(124,106,247,0.3);
    color: var(--text);
    border-top-right-radius: 3px;
  }

  .typing-indicator {
    display: flex; align-items: center; gap: 5px;
    padding: 14px 16px;
  }
  .typing-indicator span {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent); opacity: 0.6;
    animation: blink 1.2s ease infinite;
  }
  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink {
    0%, 80%, 100% { transform: scale(1); opacity: 0.4; }
    40%            { transform: scale(1.3); opacity: 1; }
  }

  .timestamp {
    font-size: 10px; color: var(--muted);
    margin-top: 4px;
    padding: 0 4px;
  }

  .input-area {
    border-top: 1px solid var(--border);
    padding: 16px 20px;
    background: var(--surface2);
    display: flex; gap: 10px; align-items: flex-end;
    flex-shrink: 0;
  }

  .input-wrap {
    flex: 1;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    display: flex; align-items: flex-end; gap: 0;
    transition: border-color 0.2s, box-shadow 0.2s;
    overflow: hidden;
  }
  .input-wrap:focus-within {
    border-color: rgba(124,106,247,0.5);
    box-shadow: 0 0 0 3px rgba(124,106,247,0.07);
  }

  textarea {
    flex: 1; resize: none; border: none; outline: none;
    background: transparent;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 13px; line-height: 1.5;
    padding: 12px 14px;
    min-height: 46px; max-height: 160px;
    overflow-y: auto;
  }
  textarea::placeholder { color: var(--muted); }

  .send-btn {
    margin: 8px; flex-shrink: 0;
    width: 34px; height: 34px;
    border: none; cursor: pointer;
    border-radius: 7px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
    transition: opacity 0.2s, transform 0.15s;
  }
  .send-btn:hover:not(:disabled) { opacity: 0.85; transform: scale(0.97); }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .suggestions {
    display: flex; gap: 8px; flex-wrap: wrap;
    padding: 0 20px 12px;
  }
  .suggestion {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 5px 12px;
    border-radius: 20px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
    letter-spacing: 0.03em;
  }
  .suggestion:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
`;

const BOT_NAME = "NOVA";

const RESPONSES = {
  default: [
    "That's an interesting question! Let me think through this carefully. There are a few key dimensions to consider, and I want to make sure I give you a thorough answer.",
    "Great point! I'd approach this by breaking it down into its core components and examining each one systematically.",
    "I can help with that. Based on what you've shared, here's my analysis and recommendation for moving forward.",
    "Absolutely! This is something I find genuinely fascinating. Let me walk you through what I know about it.",
    "Happy to help! The short answer is yes — but the full picture is a bit more nuanced, so let me explain.",
  ],
  greet: [
    "Hello! I'm NOVA, your AI assistant. What can I help you explore today?",
    "Hey there! Great to meet you. What's on your mind?",
    "Hi! I'm ready to help with anything — questions, ideas, code, writing. What'll it be?",
  ],
  thanks: [
    "You're very welcome! Let me know if there's anything else I can help with.",
    "Glad I could help! Feel free to ask anytime.",
    "Of course! That's what I'm here for.",
  ],
  bye: [
    "Goodbye! It was great chatting with you. Come back anytime!",
    "See you later! Take care 👋",
    "Until next time! Don't hesitate to return if you need anything.",
  ],
};

function getBotReply(text) {
  const t = text.toLowerCase();
  if (/^(hi|hey|hello|yo|sup|greetings)/i.test(t)) return pick(RESPONSES.greet);
  if (/thank/i.test(t)) return pick(RESPONSES.thanks);
  if (/bye|goodbye|later|farewell/i.test(t)) return pick(RESPONSES.bye);
  return pick(RESPONSES.default);
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const SUGGESTIONS = ["What can you do?", "Tell me a fun fact", "Help me write something", "Explain AI briefly"];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, role: "bot", text: "Hello! I'm NOVA — your AI assistant. Ask me anything!", time: now() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || typing) return;
    setShowSuggestions(false);
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: trimmed, time: now() }]);
    setInput("");
    setTyping(true);
    const delay = 900 + Math.random() * 800;
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "bot", text: getBotReply(trimmed), time: now() }]);
    }, delay);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="grid-bg" />
      <div className="glow-orb a" />
      <div className="glow-orb b" />

      <div className="shell">
        {/* Top Bar */}
        <div className="topbar">
          <div className="dots">
            <div className="dot red" />
            <div className="dot amber" />
            <div className="dot green" />
          </div>
          <div className="title-area">
            <div className="status-dot" />
            <h1>{BOT_NAME}</h1>
          </div>
          <span className="model-badge">v2.4-turbo</span>
        </div>

        {/* Messages */}
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id}>
              <div className={`msg ${msg.role}`}>
                <div className={`avatar ${msg.role}`}>
                  {msg.role === "bot" ? "N" : "U"}
                </div>
                <div>
                  <div className="bubble">{msg.text}</div>
                  <div className={`timestamp`} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="msg bot">
              <div className="avatar bot">N</div>
              <div className="bubble" style={{ padding: 0 }}>
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {showSuggestions && (
          <div className="suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="suggestion" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="input-area">
          <div className="input-wrap">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Type a message… (Enter to send)"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
              }}
              onKeyDown={handleKey}
            />
            <button className="send-btn" disabled={!input.trim() || typing} onClick={() => send()}>
              ↑
            </button>
          </div>
        </div>
      </div>
    </>
  );
}