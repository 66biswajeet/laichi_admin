import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { FiX, FiSend, FiMessageCircle, FiUsers } from "react-icons/fi";

const SOCKET_URL =
  import.meta.env.VITE_APP_API_SOCKET_URL || "http://localhost:5055";

const AdminLiveChat = () => {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedRoomRef = useRef(null); // Track selected room for socket listeners
  const [isOpen, setIsOpen] = useState(false);
  const [chatRequests, setChatRequests] = useState([]);
  const [activeChats, setActiveChats] = useState(new Map());
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connect socket
    console.log("🔌 Admin connecting to Socket.IO server at:", SOCKET_URL);
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
      console.log("✅ Admin socket connected:", socketRef.current.id);
      // Join admin room
      socketRef.current.emit("admin_join");
      console.log("👤 Admin joined 'admins' room");
    });

    // Listen for new chat requests
    socketRef.current.on("new_chat_request", (data) => {
      console.log("New chat request:", data);
      setChatRequests((prev) => {
        const exists = prev.find((req) => req.roomId === data.roomId);
        if (!exists) {
          setUnreadCount((count) => count + 1);
          return [...prev, data];
        }
        return prev;
      });
    });

    // Listen for chat messages
    socketRef.current.on("chat_message", (msg) => {
      console.log("Chat message received:", msg);
      setActiveChats((prev) => {
        const updated = new Map(prev);
        const roomMessages = updated.get(msg.roomId) || [];
        updated.set(msg.roomId, [...roomMessages, msg]);
        return updated;
      });

      // Use ref to get current selected room
      if (selectedRoomRef.current === msg.roomId) {
        setMessages((prev) => [...prev, msg]);
      }

      // Update unread count if not the selected room
      if (selectedRoomRef.current !== msg.roomId && !msg.isAdmin) {
        setUnreadCount((count) => count + 1);
      }
    });

    // Listen for typing notifications
    socketRef.current.on("typing", ({ roomId, userName, isTyping }) => {
      console.log(
        `${userName} is ${isTyping ? "typing" : "not typing"} in ${roomId}`,
      );
    });

    // Listen for saved chats
    socketRef.current.on("chat_saved_after_timeout", (data) => {
      console.log("Chat saved after timeout:", data);
      setChatRequests((prev) =>
        prev.filter((req) => req.roomId !== data.roomId),
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const handleAcceptChat = (request) => {
    // Join the room via socket
    socketRef.current.emit("admin_join_room", { roomId: request.roomId });
    console.log("👨‍💼 Admin joining room:", request.roomId);

    const roomMessages = activeChats.get(request.roomId) || [];
    setSelectedRoom(request.roomId);
    selectedRoomRef.current = request.roomId; // Update ref
    setMessages(roomMessages);

    // Remove from requests
    setChatRequests((prev) =>
      prev.filter((req) => req.roomId !== request.roomId),
    );
    setUnreadCount(0);
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedRoom) return;

    const payload = {
      roomId: selectedRoom,
      from: "Support Agent",
      text: input.trim(),
      isAdmin: true,
    };

    socketRef.current.emit("chat_message", payload);
    setMessages((prev) => [
      ...prev,
      { ...payload, createdAt: new Date(), fromMe: true },
    ]);
    setInput("");
  };

  const endChatSession = () => {
    if (!selectedRoom) return;

    // Emit end chat event to server
    socketRef.current.emit("end_chat_session", { roomId: selectedRoom });
    console.log("🔚 Ending chat session:", selectedRoom);

    // Clear local chat data
    setActiveChats((prev) => {
      const updated = new Map(prev);
      updated.delete(selectedRoom);
      return updated;
    });

    // Reset selected room and messages
    setSelectedRoom(null);
    selectedRoomRef.current = null;
    setMessages([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getTopicEmoji = (topic) => {
    switch (topic) {
      case "design":
        return "🎨";
      case "order":
        return "📦";
      case "delivery":
        return "🚚";
      default:
        return "💬";
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-40"
        aria-label="Admin Chat"
      >
        <FiMessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[600px] h-[600px] bg-white border border-gray-300 rounded-lg shadow-2xl z-50 flex">
          {/* Sidebar - Chat Requests */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="bg-blue-600 text-white p-4 rounded-tl-lg">
              <div className="flex items-center gap-2">
                <FiUsers size={20} />
                <h3 className="font-bold">Chat Requests</h3>
              </div>
              <p className="text-xs text-blue-100 mt-1">
                {chatRequests.length} waiting
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chatRequests.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No active requests
                </div>
              ) : (
                chatRequests.map((request) => (
                  <div
                    key={request.roomId}
                    onClick={() => handleAcceptChat(request)}
                    className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors ${
                      selectedRoom === request.roomId ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {getTopicEmoji(request.topic)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {request.name}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {request.topic} issue
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(request.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="bg-blue-600 text-white p-4 rounded-tr-lg flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold">
                  {selectedRoom ? "Active Chat" : "Select a chat"}
                </h3>
                {selectedRoom && (
                  <p className="text-xs text-blue-100">Room: {selectedRoom}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedRoom && (
                  <button
                    onClick={endChatSession}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                    title="End Chat Session"
                  >
                    <FiX size={16} />
                    End Chat
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-blue-700 p-1 rounded transition-colors"
                  aria-label="Close"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {selectedRoom ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.map((msg, index) => {
                    const isMe = msg.fromMe || msg.isAdmin;
                    return (
                      <div
                        key={index}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            isMe
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-800 border border-gray-200"
                          }`}
                        >
                          {!isMe && (
                            <div className="text-xs font-semibold mb-1 text-blue-600">
                              {msg.from}
                            </div>
                          )}
                          <div className="text-sm break-words">{msg.text}</div>
                          <div
                            className={`text-xs mt-1 ${
                              isMe ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white rounded-br-lg">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your response..."
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Send message"
                    >
                      <FiSend size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FiMessageCircle
                    size={48}
                    className="mx-auto mb-2 opacity-50"
                  />
                  <p>Select a chat request to start</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLiveChat;
