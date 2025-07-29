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
    saveSession
  } = useContext(AppContext);

  // Detect screen width change
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setExtended(false); // Default collapse on mobile
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNewChat = () => {
    if (chatHistory.length > 0) saveSession(chatHistory);
    setChatHistory([]);
    alert("🆕 Started a new chat session.");
  };

  const handleHelp = () => {
    alert("🆘 Help:\nAsk anything like: 'What is AI?' or 'Suggest UI improvements'");
  };

  const handleActivity = () => {
    alert(`📜 You have ${allSessions.length} saved chat sessions.`);
  };

  const handleSettings = () => {
    alert("⚙️ Settings: Coming soon!");
  };

  const handleSessionClick = (session) => {
    setChatHistory(session.chat || []);
    if (isMobile) setExtended(false); 
  };

  return (
    <motion.div
      initial={{ width: 80 }}
      animate={{ width: extended ? 250 : 80 }}
      transition={{ duration: 0.3 }}
      className={`Sidebar ${extended ? "expanded" : ""}`}
    >
      {/* Menu Icon */}
      <motion.img
        whileTap={{ scale: 0.9 }}
        whileHover={{ rotate: 90 }}
        onClick={() => setExtended(prev => !prev)}
        className="menu "
        src={assets.menu_icon}
        alt="menu"
      />

      {/* Top Section */}
      <div className="top">
        {/* New Chat */}
        {extended && (
          <motion.div
            className="new-chat"
            onClick={handleNewChat}
            whileHover={{ scale: 1.05 }}
          >
            <img src={assets.plus_icon} alt="new chat" />
            <p>New Chat</p>
          </motion.div>
        )}

        {/* Recents */}
        <AnimatePresence>
          {extended && (
            <motion.div
              className="recent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {allSessions.map((session, i) => (
                <motion.div
                  key={session.id || i}
                  className="recent-entry"
                  onClick={() => handleSessionClick(session)}
                  whileHover={{ scale: 1.03 }}
                >
                  <img src={assets.message_icon} alt="chat" />
                  <p>
                    {(session.chat.find(msg => msg.role === "user")?.prompt || "Empty").slice(0, 30)}
                    ...
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Section */}
      {extended && (
        <div className="bottom">
          <motion.div
            className="bottom-item recent-entry"
            onClick={handleHelp}
            whileHover={{ scale: 1.05 }}
          >
            <img src={assets.question_icon} alt="Help" />
            <p>Help</p>
          </motion.div>

          <motion.div
            className="bottom-item recent-entry"
            onClick={handleActivity}
            whileHover={{ scale: 1.05 }}
          >
            <img src={assets.history_icon} alt="Activity" />
            <p>Activity</p>
          </motion.div>

          <motion.div
            className="bottom-item recent-entry"
            onClick={handleSettings}
            whileHover={{ scale: 1.05 }}
          >
            <img src={assets.setting_icon} alt="Settings" />
            <p>Settings</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;
