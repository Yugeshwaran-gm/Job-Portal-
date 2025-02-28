import { useEffect, useState } from "react";
import { useMessages } from "../../context/messagesContext";
import "./styles/Messages.css";
import Navbar from "../Common/Navbar";

const Messages = () => {
  const [role, setRole] = useState(null);
  const { messages, users, sendMessage, fetchMessages, fetchUsers, updateMessageStatus } = useMessages();
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // ✅ Ensure user data is properly parsed
  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (loggedInUser?.role) {
      setRole(loggedInUser.role);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(loggedInUser.id, selectedUser._id);

      // ✅ Mark messages as 'read'
      messages.forEach((msg) => {
        if (msg.receiver === loggedInUser.id && msg.status !== "read") {
          updateMessageStatus(msg._id, "read");
        }
      });
    }
  }, [selectedUser, messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    await sendMessage(loggedInUser.id, selectedUser._id, newMessage);
    setNewMessage("");

    // Fetch updated messages after sending
    fetchMessages(loggedInUser.id, selectedUser._id);
  };

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.sender === loggedInUser.id && msg.receiver === selectedUser?._id) ||
      (msg.sender === selectedUser?._id && msg.receiver === loggedInUser.id)
  );

  return (
    <div className="chat-container">
      <div className="user-list">
        {role && <Navbar role={role} />}
        <h3>Users</h3>
        {users
          .filter((user) => user._id !== loggedInUser.id)
          .map((user) => (
            <div key={user._id} onClick={() => setSelectedUser(user)} className="user-item">
              {user.name}
            </div>
          ))}
      </div>
      <div className="chat-box">
        <h3>Chat with {selectedUser?.name || "..."}</h3>
        <div className="messages">
          {filteredMessages.map((msg, index) => (
            <div key={msg._id || `msg-${index}`} className={msg.sender === loggedInUser.id ? "sent" : "received"}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
