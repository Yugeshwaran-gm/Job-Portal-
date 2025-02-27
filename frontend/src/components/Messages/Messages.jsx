import { useEffect, useState, useContext } from "react";
import { useMessages } from "../../context/messagesContext";
import "./styles/Messages.css";
import Navbar from '../Common/Navbar';



const Messages = () => {
  const [role, setRole] = useState(null);
  const { messages, users, sendMessage, fetchMessages, fetchUsers, updateMessageStatus } = useMessages();
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    try {
      
      if (loggedInUser) {
        const parsedData = JSON.parse(loggedInUser);
        setRole(parsedData?.role || null);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setRole(null);
    }
  }, []);

  useEffect(() => {
   
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(loggedInUser.id, selectedUser._id);

      // ✅ Update messages as 'read' when chat is opened
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

  // ✅ Filter messages to show only those exchanged with the selected user
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.sender === loggedInUser.id && msg.receiver === selectedUser?._id) ||
      (msg.sender === selectedUser?._id && msg.receiver === loggedInUser.id)
  );

  // ✅ Function to display message status
  const getMessageStatus = (status) => {
    if (status === "sent") return "✓";
    if (status === "delivered") return "✓✓";
    if (status === "read") return "✓✓✔️";
    return "";
  };

  return (
    <div className="chat-container">
      <div className="user-list">
      {role && <Navbar role={role} />}
        <h3>Users</h3>
        {users
          .filter((user) => user._id !== loggedInUser.id) // ✅ Exclude logged-in user
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
              {msg.content} <span className="message-status">{getMessageStatus(msg.status)}</span>
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
