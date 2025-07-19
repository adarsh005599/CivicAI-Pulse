import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { AppContext } from "../../Context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const {
    chatHistory,
    setChatHistory,
    allSessions,
    saveSession,
    selectedSession,
    setSelectedSession,
  } = useContext(AppContext);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNewChat = () => {
    if (chatHistory.length > 0) {
      saveSession(chatHistory);
    }
    setChatHistory([]);
    setSelectedSession(null);
    alert("🆕 Started a new chat session.");
    if (isMobile) setExtended(false);
  };

  const handleHelp = () => alert("🆘 Help: Ask anything!");
  const handleActivity = () => alert(`📜 You have ${allSessions.length} saved sessions.`);
  const handleSettings = () => alert("⚙️ Settings coming soon!");

  const handleSessionClick = (session) => {
    setChatHistory(session.chat);
    setSelectedSession(session);
    if (isMobile) setExtended(false);
  };

  return (
    <motion.div
      initial={{ width: isMobile ? 0 : 80 }}
      animate={{ width: extended ? 250 : isMobile ? 0 : 80 }}
      transition={{ duration: 0.3 }}
      className={`Sidebar ${extended ? "expanded" : ""}`}
    >
      <motion.img
        whileTap={{ scale: 0.9 }}
        whileHover={{ rotate: 90 }}
        onClick={() => setExtended(prev => !prev)}
        className="menu"
        src={assets.menu_icon}
        alt="menu"
      />

      {/* Top Section */}
      <div className="top">
        <motion.div
          className="new-chat"
          onClick={handleNewChat}
          whileHover={{ scale: 1.05 }}
        >
          <img src={assets.plus_icon} alt="new chat" />
          {extended && <p>New Chat</p>}
        </motion.div>

        <AnimatePresence>
          {extended && (
            <motion.div
              className="recent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="recent-title">Recent</p>
              {allSessions.map((session) => (
                <motion.div
                  key={session.id}
                  className={`recent-entry ${selectedSession?.id === session.id ? "active-chat" : ""}`}
                  onClick={() => handleSessionClick(session)}
                  whileHover={{ scale: 1.03 }}
                >
                  <img src={assets.message_icon} alt="chat" />
                  <p>
                    {(session.chat.find(msg => msg.role === "user")?.prompt || "Empty").slice(0, 30)}...
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Section */}
      <div className="bottom">
        <motion.div
          className="bottom-item recent-entry"
          onClick={handleHelp}
          whileHover={{ scale: 1.05 }}
        >
          <img src={assets.question_icon} alt="Help" />
          {extended && <p>Help</p>}
        </motion.div>
        <motion.div
          className="bottom-item recent-entry"
          onClick={handleActivity}
          whileHover={{ scale: 1.05 }}
        >
          <img src={assets.history_icon} alt="Activity" />
          {extended && <p>Activity</p>}
        </motion.div>
        <motion.div
          className="bottom-item recent-entry"
          onClick={handleSettings}
          whileHover={{ scale: 1.05 }}
        >
          <img src={assets.setting_icon} alt="Settings" />
          {extended && <p>Settings</p>}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
