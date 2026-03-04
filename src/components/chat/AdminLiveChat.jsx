import React, { useEffect, useRef, useState, useMemo } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
import {
  FiX,
  FiSend,
  FiMessageCircle,
  FiUsers,
  FiEye,
  FiBarChart2,
} from "react-icons/fi";

const SOCKET_URL =
  import.meta.env.VITE_APP_API_SOCKET_URL || "http://localhost:5055";

const AdminLiveChat = () => {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedRoomRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [chatRequests, setChatRequests] = useState([]); // pending unassigned chats
  const [assignedChats, setAssignedChats] = useState([]); // chats assigned to this admin
  const [activeChats, setActiveChats] = useState(new Map());
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminRole, setAdminRole] = useState(""); // role from server
  const [showReport, setShowReport] = useState(false); // toggle report view
  const [reportData, setReportData] = useState(null); // chat report data
  const [reportLoading, setReportLoading] = useState(false);

  // Get admin info from cookie
  const getAdminInfo = () => {
    try {
      const info = Cookies.get("adminInfo");
      return info ? JSON.parse(info) : {};
    } catch {
      return {};
    }
  };

  const adminInfo = getAdminInfo();
  const isSuperAdmin = adminRole === "Super Admin";

  // Determine if the currently selected chat is read-only for this admin
  // Super Admin viewing another staff's chat = read-only
  const isReadOnly = useMemo(() => {
    if (!selectedRoom || !isSuperAdmin) return false;
    const chat = assignedChats.find((c) => c.roomId === selectedRoom);
    if (!chat) return false;
    return chat.assignedTo && chat.assignedTo !== adminInfo._id;
  }, [selectedRoom, isSuperAdmin, assignedChats, adminInfo._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("🔌 Admin connecting to Socket.IO server at:", SOCKET_URL);
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
      console.log("✅ Admin socket connected:", socketRef.current.id);
      // Join admin room with adminId so server can track sockets
      socketRef.current.emit("admin_join", { adminId: adminInfo._id });
      console.log("👤 Admin joined 'admins' room, adminId:", adminInfo._id);
    });

    // Listen for role info from server
    socketRef.current.on("admin_role_info", ({ role }) => {
      console.log("🔑 Admin role:", role);
      setAdminRole(role);
    });

    // Listen for chats auto-assigned to this admin
    socketRef.current.on("assigned_chat", (data) => {
      console.log("📋 Chat assigned:", data);
      setAssignedChats((prev) => {
        const exists = prev.find((c) => c.roomId === data.roomId);
        if (!exists) {
          setUnreadCount((count) => count + 1);
          return [
            ...prev,
            {
              ...data,
              assignedTo: data.assignedTo,
              assignedStaffName: data.assignedStaffName,
            },
          ];
        }
        return prev;
      });
      // Auto-join the room so this admin can see messages
      socketRef.current.emit("admin_join_room", { roomId: data.roomId });
    });

    // Listen for new pending chat requests (no staff available)
    socketRef.current.on("new_chat_request", (data) => {
      console.log("New pending chat request:", data);
      setChatRequests((prev) => {
        const exists = prev.find((req) => req.roomId === data.roomId);
        if (!exists) {
          setUnreadCount((count) => count + 1);
          return [...prev, data];
        }
        return prev;
      });
    });

    // Listen for assignment updates (to remove from pending list)
    socketRef.current.on("chat_assignment_update", (data) => {
      setChatRequests((prev) =>
        prev.filter((req) => req.roomId !== data.roomId),
      );
    });

    // Listen for chat messages
    socketRef.current.on("chat_message", (msg) => {
      setActiveChats((prev) => {
        const updated = new Map(prev);
        const roomMessages = updated.get(msg.roomId) || [];
        updated.set(msg.roomId, [...roomMessages, msg]);
        return updated;
      });

      if (selectedRoomRef.current === msg.roomId) {
        setMessages((prev) => [...prev, msg]);
      }

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

    // Listen for expired chats
    socketRef.current.on("chat_expired_notification", (data) => {
      console.log("Chat expired:", data);
      setChatRequests((prev) =>
        prev.filter((req) => req.roomId !== data.roomId),
      );
      setAssignedChats((prev) => prev.filter((c) => c.roomId !== data.roomId));
    });

    // Listen for saved/timeout chats
    socketRef.current.on("chat_saved_after_timeout", (data) => {
      setChatRequests((prev) =>
        prev.filter((req) => req.roomId !== data.roomId),
      );
    });

    // Listen for chat resolved (staff ended the chat)
    socketRef.current.on("chat_resolved", (data) => {
      console.log("Chat resolved:", data);
      setAssignedChats((prev) => prev.filter((c) => c.roomId !== data.roomId));
      setChatRequests((prev) => prev.filter((r) => r.roomId !== data.roomId));
      // If we're viewing this chat, clear it
      if (selectedRoomRef.current === data.roomId) {
        setSelectedRoom(null);
        selectedRoomRef.current = null;
        setMessages([]);
      }
    });

    // Listen for chat history response (fallback if callback not used)
    socketRef.current.on("chat_history", ({ roomId, messages: history }) => {
      if (selectedRoomRef.current === roomId) {
        const liveMessages = activeChats.get(roomId) || [];
        setMessages([...history, ...liveMessages]);
      }
    });

    // Listen for staff status updates
    socketRef.current.on("staff_status_updated", ({ adminId, newStatus }) => {
      // If this admin's status was changed (e.g., set to busy by system)
      if (adminId === adminInfo._id) {
        console.log("My status updated to:", newStatus);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleAcceptChat = (request, fromAssigned = false) => {
    socketRef.current.emit("admin_join_room", { roomId: request.roomId });
    console.log("👨‍💼 Admin joining room:", request.roomId);

    setShowReport(false); // exit report view when selecting a chat
    setSelectedRoom(request.roomId);
    selectedRoomRef.current = request.roomId;
    setMessages([]); // clear while loading

    // Fetch full chat history from DB
    socketRef.current.emit(
      "fetch_chat_history",
      { roomId: request.roomId },
      (response) => {
        if (response?.success && response.messages?.length > 0) {
          // Merge DB history + any live messages received since socket connected
          const liveMessages = activeChats.get(request.roomId) || [];
          // Deduplicate: use createdAt+text as key
          const seen = new Set();
          const merged = [];
          for (const m of [...response.messages, ...liveMessages]) {
            const key = `${m.text}_${new Date(m.createdAt).getTime()}`;
            if (!seen.has(key)) {
              seen.add(key);
              merged.push(m);
            }
          }
          merged.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setMessages(merged);
        } else {
          // No DB history, show only live messages
          const liveMessages = activeChats.get(request.roomId) || [];
          setMessages(liveMessages);
        }
      },
    );

    if (fromAssigned) {
      // Already assigned, just selecting it
    } else {
      // Remove from pending requests
      setChatRequests((prev) =>
        prev.filter((req) => req.roomId !== request.roomId),
      );
    }
    setUnreadCount(0);
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedRoom || isReadOnly) return;

    const staffName = adminInfo?.name?.en || adminInfo?.name || "Support Agent";

    const payload = {
      roomId: selectedRoom,
      from: staffName,
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
    if (!selectedRoom || isReadOnly) return;

    socketRef.current.emit("end_chat_session", { roomId: selectedRoom });
    console.log("🔚 Ending chat session:", selectedRoom);

    setActiveChats((prev) => {
      const updated = new Map(prev);
      updated.delete(selectedRoom);
      return updated;
    });

    // Remove from assigned chats
    setAssignedChats((prev) => prev.filter((c) => c.roomId !== selectedRoom));

    setSelectedRoom(null);
    selectedRoomRef.current = null;
    setMessages([]);
  };

  const fetchReport = () => {
    if (!socketRef.current || !isSuperAdmin) return;
    setReportLoading(true);
    socketRef.current.emit("fetch_chat_report", {}, (response) => {
      setReportLoading(false);
      if (response?.success) {
        setReportData(response.report);
      }
    });
  };

  const toggleReport = () => {
    if (!showReport) {
      fetchReport();
      setSelectedRoom(null);
      selectedRoomRef.current = null;
      setMessages([]);
    }
    setShowReport(!showReport);
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

  // Split assigned chats into own vs other staff (for Super Admin)
  const myChats = assignedChats.filter((c) => c.assignedTo === adminInfo._id);
  const otherStaffChats = assignedChats.filter(
    (c) => c.assignedTo && c.assignedTo !== adminInfo._id,
  );

  const allChats = [
    ...assignedChats.map((c) => ({ ...c, type: "assigned" })),
    ...chatRequests.map((c) => ({ ...c, type: "pending" })),
  ];

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
          {/* Sidebar - Chat List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="bg-blue-600 text-white p-4 rounded-tl-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiUsers size={20} />
                  <h3 className="font-bold">Chats</h3>
                </div>
                {isSuperAdmin && (
                  <button
                    onClick={toggleReport}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      showReport
                        ? "bg-white text-blue-600"
                        : "bg-blue-500 hover:bg-blue-400 text-white"
                    }`}
                    title="Chat Report"
                  >
                    <FiBarChart2 size={14} />
                    Report
                  </button>
                )}
              </div>
              <p className="text-xs text-blue-100 mt-1">
                {myChats.length} mine
                {isSuperAdmin
                  ? ` · ${otherStaffChats.length} staff`
                  : ""} · {chatRequests.length} pending
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {allChats.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No active chats
                </div>
              ) : (
                <>
                  {/* My assigned chats */}
                  {myChats.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wide border-b">
                        {isSuperAdmin ? "My Chats" : "Active Chats"}
                      </div>
                      {myChats.map((chat) => (
                        <div
                          key={chat.roomId}
                          onClick={() => handleAcceptChat(chat, true)}
                          className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors ${
                            selectedRoom === chat.roomId
                              ? "bg-blue-50 border-l-4 border-l-blue-600"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">
                              {getTopicEmoji(chat.topic)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">
                                {chat.name}
                              </div>
                              <div className="text-xs text-gray-500 capitalize">
                                {chat.topic} issue
                              </div>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(chat.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Other staff chats (Super Admin only) */}
                  {isSuperAdmin && otherStaffChats.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wide border-b flex items-center gap-1">
                        <FiEye size={12} />
                        Staff Chats (View Only)
                      </div>
                      {otherStaffChats.map((chat) => (
                        <div
                          key={chat.roomId}
                          onClick={() => handleAcceptChat(chat, true)}
                          className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-purple-50 transition-colors ${
                            selectedRoom === chat.roomId
                              ? "bg-purple-50 border-l-4 border-l-purple-600"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">
                              {getTopicEmoji(chat.topic)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">
                                {chat.name}
                              </div>
                              <div className="text-xs text-gray-500 capitalize">
                                {chat.topic} issue
                              </div>
                              <div className="text-xs text-purple-600 mt-0.5">
                                Agent: {chat.assignedStaffName}
                              </div>
                            </div>
                            <FiEye
                              size={14}
                              className="text-purple-400 flex-shrink-0"
                            />
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(chat.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pending chats (unassigned) */}
                  {chatRequests.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-semibold uppercase tracking-wide border-b">
                        Pending / Waiting
                      </div>
                      {chatRequests.map((request) => (
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
                            <span className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(request.timestamp).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Chat Area / Report View */}
          <div className="flex-1 flex flex-col">
            <div className="bg-blue-600 text-white p-4 rounded-tr-lg flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold">
                  {showReport
                    ? "Chat Report"
                    : selectedRoom
                      ? "Active Chat"
                      : "Select a chat"}
                </h3>
                {selectedRoom && !showReport && (
                  <p className="text-xs text-blue-100">Room: {selectedRoom}</p>
                )}
                {showReport && (
                  <p className="text-xs text-blue-100">
                    Resolved chat statistics
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedRoom && !isReadOnly && (
                  <button
                    onClick={endChatSession}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                    title="End Chat Session"
                  >
                    <FiX size={16} />
                    End Chat
                  </button>
                )}
                {selectedRoom && isReadOnly && (
                  <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-100 px-3 py-1 rounded text-xs font-medium">
                    <FiEye size={14} />
                    View Only
                  </span>
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

            {showReport ? (
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {reportLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                      <p className="text-sm">Loading report...</p>
                    </div>
                  </div>
                ) : reportData ? (
                  <div className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {reportData.totalChats}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total Chats
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {reportData.resolvedCount}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Resolved
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-emerald-600">
                          {reportData.resolvedPercentage}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Resolve Rate
                        </div>
                      </div>
                    </div>

                    {/* Staff Breakdown */}
                    {reportData.staffBreakdown.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <h4 className="font-semibold text-sm text-gray-700">
                            Staff Performance
                          </h4>
                        </div>
                        {reportData.staffBreakdown.map((staff, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-800">
                                {staff.staffName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {staff.resolvedCount} resolved (
                                {staff.percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${staff.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Resolved Chat List */}
                    {reportData.staffBreakdown.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <h4 className="font-semibold text-sm text-gray-700">
                            Resolved Chats
                          </h4>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-[250px] overflow-y-auto">
                          {reportData.staffBreakdown.flatMap((staff) =>
                            staff.chats.map((chat, idx) => (
                              <div
                                key={`${staff.staffName}-${idx}`}
                                className="px-4 py-2.5 flex items-center justify-between"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-800 truncate">
                                    {chat.userName}
                                  </div>
                                  <div className="text-xs text-gray-500 capitalize">
                                    {chat.topic} issue
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-3">
                                  <div className="text-xs font-medium text-blue-600">
                                    {staff.staffName}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {chat.resolvedAt
                                      ? new Date(
                                          chat.resolvedAt,
                                        ).toLocaleDateString([], {
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "—"}
                                  </div>
                                </div>
                              </div>
                            )),
                          )}
                        </div>
                      </div>
                    )}

                    {reportData.staffBreakdown.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <FiBarChart2
                          size={40}
                          className="mx-auto mb-2 opacity-50"
                        />
                        <p className="text-sm">No resolved chats yet</p>
                      </div>
                    )}

                    {/* Refresh Button */}
                    <div className="text-center pt-2">
                      <button
                        onClick={fetchReport}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Refresh Report
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p className="text-sm">Failed to load report data</p>
                  </div>
                )}
              </div>
            ) : selectedRoom ? (
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
                  {isReadOnly ? (
                    <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg text-gray-500 text-sm">
                      <FiEye size={16} />
                      <span>
                        You are viewing this chat in read-only mode. Only the
                        assigned agent can reply.
                      </span>
                    </div>
                  ) : (
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
                  )}
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
