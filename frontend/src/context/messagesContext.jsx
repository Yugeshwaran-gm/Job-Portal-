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
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/users");
      setUsers(data);
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
      });

      socket.emit("sendMessage", data);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <MessageContext.Provider value={{ messages, users, sendMessage, fetchMessages, fetchUsers }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);
