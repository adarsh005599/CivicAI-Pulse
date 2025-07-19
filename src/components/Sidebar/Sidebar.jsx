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

  // Auto update mobile check on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleHelp = () => {
    alert("🆘 Help:\nAsk anything like: 'What is AI?' or 'Suggest UI improvements'");
  };

  const handleActivity = () => {
    alert(`📜 You have ${allSessions.length} saved chat sessions.`);
  };

  const handleNewChat = () => {
    if (chatHistory.length > 0) {
      saveSession(chatHistory); // ✅ Save the current visible chat
    }
    setChatHistory([]); // ✅ Clear only the current chat
    alert("🆕 Started a new chat session.");

    if (isMobile) setExtended(false); // Auto-close on mobile
  };

  const handleSettings = () => {
    alert("⚙️ Settings: Coming soon!");
  };

  const handleSessionClick = () => {
    if (isMobile) setExtended(false); // Auto-close on mobile
  };

  return (
    <motion.div
      initial={{ width: isMobile ? 0 : 80 }}
      animate={{ width: extended ? 250 : isMobile ? 0 : 80 }}
      transition={{ duration: 0.3 }}
      className={`Sidebar ${extended ? "expanded" : ""}`}
    >
      {/* Menu Button */}
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
        {/* New Chat Button */}
        <motion.div
          className="new-chat"
          onClick={handleNewChat}
          whileHover={{ scale: 1.05 }}
        >
          <img src={assets.plus_icon} alt="new chat" />
          {extended && <p>New Chat</p>}
        </motion.div>

        {/* Recent Chats */}
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
              {allSessions.map((session, i) => (
                <motion.div
                  key={session.id}
                  className="recent-entry"
                  onClick={handleSessionClick}
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

      {/* Bottom Actions */}
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
