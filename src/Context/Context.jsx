import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [allSessions, setAllSessions] = useState([]);

  // Load previous sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem("allSessions")) || [];
    setAllSessions(savedSessions);
  }, []);

  // Save new session to localStorage
  const saveSession = (newChat) => {
    const updatedSessions = [
      ...allSessions,
      { id: Date.now(), chat: newChat }
    ];
    setAllSessions(updatedSessions);
    localStorage.setItem("allSessions", JSON.stringify(updatedSessions));
  };

  return (
    <AppContext.Provider value={{
      chatHistory,
      setChatHistory,
      allSessions,
      saveSession,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
