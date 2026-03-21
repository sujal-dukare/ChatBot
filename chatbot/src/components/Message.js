import React from "react";

function Message({ message }) {
  return (
    <div className={`message-wrapper ${message.sender === "user" ? "user-wrapper" : "bot-wrapper"}`}>
      
      <div className={`avatar ${message.sender === "user" ? "user-avatar" : "bot-avatar"}`}>
        {message.sender === "user" ? "🧑🏻‍💼" : "🤖"}
      </div>

      <div className={`message-bubble ${message.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
        <p>{message.text}</p>
        <span className="timestamp">{message.time}</span>
      </div>

    </div>
  );
}

export default Message;