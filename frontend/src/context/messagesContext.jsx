import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const MessageContext = createContext();
const socket = io("http://localhost:3000");

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);

      // ✅ Mark message as "delivered" when received
      updateMessageStatus(message._id, "delivered");
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const fetchMessages = async (sender, receiver) => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/messages?sender=${sender}&receiver=${receiver}`
      );
      setMessages(data);

      // ✅ Mark messages as "read" when chat is opened
      data.forEach((msg) => {
        if (msg.receiver === sender && msg.status !== "read") {
          updateMessageStatus(msg._id, "read");
        }
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchUsers = async (loggedInUserId) => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/users");
      const filteredUsers = data.filter((user) => user._id !== loggedInUserId);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const sendMessage = async (sender, receiver, content) => {
    try {
      const { data } = await axios.post("http://localhost:3000/api/messages", {
        sender,
        receiver,
        content,
        status: "sent", // ✅ Initially set status to "sent"
      });

      socket.emit("sendMessage", data);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      await axios.put("http://localhost:3000/api/messages/status", {
        messageId,
        status,
      });

      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg))
      );

      // ✅ Emit socket event for real-time status updates
      socket.emit("updateStatus", { messageId, status });
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  return (
    <MessageContext.Provider value={{ messages, users, sendMessage, fetchMessages, fetchUsers, updateMessageStatus }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
