

import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ messages, message, setMessage, sendGuess }) => {
  return (
    <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden ">
      {/* Scrollable message area */}
      <ScrollToBottom className="flex-1 p-3 space-y-1 text-sm">
        {messages.map((msg, i) => (
          <div key={i} className="leading-tight">
            {msg.username !== "server" && (
              <span className="font-semibold text-black mr-1">
                {msg.username}:
              </span>
            )}
            <span style={{ color: msg.color }}>{msg.message}</span>
          </div>
        ))}
      </ScrollToBottom>

      {/* Input form */}
      <form
        className="flex items-center gap-2 p-2 border-t"
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = message.trim();
          if (!trimmed) return;
          sendGuess(trimmed);
          setMessage("");
        }}
      >
        <input
          className="flex-1 px-3 py-1 border rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type your guess..."
          value={message}
          type="text"
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-1 rounded bg-[#2bab2b] text-white font-semibold hover:bg-[#1d851d]"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
