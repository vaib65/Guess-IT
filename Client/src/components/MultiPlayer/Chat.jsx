import React, { useContext, useState } from "react";
import { GameContext } from "../../context/GameContext";
import ScrollToBottom from "react-scroll-to-bottom";

export default function Chat() {
  const { messages, sendGuess } = useContext(GameContext);
  const [message, setMessage] = useState("");

  return (
    <div className="h-[75vh] flex flex-col">
      {/* Scrollable message area */}
      <ScrollToBottom className=" flex-1 overflow-y-auto p-2 text-left">
        {messages.map(({ username, message, color }, i) => (
          <div key={i} className="p-1">
            <span
              className={`font-bold text-black ${
                username === "server" ? "hidden" : ""
              }`}
            >
              {`${username}: `}
            </span>
            <span style={{ color }}>{message}</span>
          </div>
        ))}
      </ScrollToBottom>

      {/* Input form */}
      <form
        className="flex items-center gap-2 p-3 border-t border-black"
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = message.trim();
          if (!trimmed) return;
          sendGuess(trimmed);
          setMessage("");
        }}
      >
        <label className="font-semibold text-black">Guess:</label>
        <input
          className="flex-grow p-1 border rounded text-black"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          type="text"
        />
        <button
          className="px-4 py-2 bg-[#2bab2b] text-white rounded hover:bg-[#1d851d]"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}
