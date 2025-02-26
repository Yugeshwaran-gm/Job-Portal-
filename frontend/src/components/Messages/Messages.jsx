import { useEffect, useState } from "react";
import { useMessages } from "../../context/messagesContext";
import "./styles/Messages.css";

const Messages = () => {
  const { messages, users, sendMessage, fetchMessages, fetchUsers } = useMessages();
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) fetchMessages(loggedInUser.id, selectedUser._id);
  }, [selectedUser]);

  const handleSend = () => {
    if (!newMessage || !selectedUser) return;
    sendMessage(loggedInUser.id, selectedUser._id, newMessage);
    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3>Users</h3>
        {users.map((user) => (
          <div key={user._id} onClick={() => setSelectedUser(user)} className="user-item">
            {user.name}
          </div>
        ))}
      </div>
      <div className="chat-box">
        <h3>Chat with {selectedUser?.name || "..."}</h3>
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg._id} className={msg.sender === loggedInUser.id ? "sent" : "received"}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="message-input">
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
