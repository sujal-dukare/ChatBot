import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";

function ChatBot() {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hey Sujal! 👋 I'm your  persnal assistant.",
      time: getCurrentTime(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const getBotReply = (text) => {
    text = text.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) return "Hello! 😊";
    if (text.includes("course")) return "We have Java, Python, React courses.";
    if (text.includes("bye")) return "Goodbye 👋";
    if (text.includes("name") || text.includes("hi")) return "Sujal ! 😊";
    if (text.includes("collage") || text.includes("hi")) return "Suryodaya College of Engineering & Technology! 😊";
    return "I didn't understand 🤔";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      text: input,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        sender: "bot",
        text: getBotReply(input),
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">🤖 ChatBot</div>

      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <Message key={i} message={msg} />
        ))}

        {isTyping && <p>Typing...</p>}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="chatbot-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBot;