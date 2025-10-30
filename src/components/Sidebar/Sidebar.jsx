import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { AppContext } from "../../Context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // NEW STATE: Controls the open/closed state specifically for mobile overlay
  const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState(false);

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
      if (mobile) {
        setExtended(false); // Ensure desktop logic is collapsed on mobile
      } else {
        // Close mobile overlay when transitioning back to desktop
        setIsSidebarOpenOnMobile(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine if content should be visible (expanded on desktop, or explicitly open on mobile)
  const isContentVisible = isMobile ? isSidebarOpenOnMobile : extended;

  // Toggle function handles both desktop and mobile logic cleanly
  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpenOnMobile(prev => !prev);
    } else {
      setExtended(prev => !prev);
    }
  };

  const handleNewChat = () => {
    if (chatHistory.length > 0) saveSession(chatHistory);
    setChatHistory([]);
    alert("🆕 Started a new chat session.");
    if (isMobile) setIsSidebarOpenOnMobile(false); // Close on mobile after action
  };

  const handleSessionClick = (session) => {
    setChatHistory(session.chat || []);
    if (isMobile) setIsSidebarOpenOnMobile(false); // Close on mobile after action
  };
  
  // Placeholder handlers - close sidebar on mobile after alert
  const handleHelp = () => {
    alert("🆘 Help:\nAsk anything like: 'What is AI?' or 'Suggest UI improvements'");
    if (isMobile) setIsSidebarOpenOnMobile(false);
  };
  const handleActivity = () => {
    alert(`📜 You have ${allSessions.length} saved chat sessions.`);
    if (isMobile) setIsSidebarOpenOnMobile(false);
  };
  const handleSettings = () => {
    alert("⚙️ Settings: Coming soon!");
    if (isMobile) setIsSidebarOpenOnMobile(false);
  };


  return (
    <>
      {/* Mobile Overlay Backdrop (only visible when mobile and open) */}
      <AnimatePresence>
        {isMobile && isSidebarOpenOnMobile && (
          <motion.div
            className="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsSidebarOpenOnMobile(false)} // Click backdrop to close
          />
        )}
      </AnimatePresence>

      <motion.div
        // Conditional width/style based on device/state
        initial={{ width: 80 }}
        animate={{ 
            width: isMobile ? (isSidebarOpenOnMobile ? 250 : 80) : (extended ? 250 : 80),
            // Add a class for mobile to enable fixed/full-height positioning
        }}
        transition={{ duration: 0.3 }}
        className={`Sidebar ${isContentVisible ? "expanded" : ""} ${isMobile && isSidebarOpenOnMobile ? "mobile-open" : ""}`}
      >
        {/* Menu Icon (Always visible) */}
        <motion.img
          whileTap={{ scale: 0.9 }}
          whileHover={{ rotate: 90 }}
          onClick={toggleSidebar}
          className="menu"
          src={assets.menu_icon}
          alt="menu"
        />

        {/* Top Section (Visible only when isContentVisible is true) */}
        <AnimatePresence>
          {isContentVisible && (
            <motion.div
              className="top-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* New Chat */}
              <motion.div
                className="new-chat"
                onClick={handleNewChat}
                whileHover={{ scale: 1.05 }}
              >
                <img src={assets.plus_icon} alt="new chat" />
                <p>New Chat</p>
              </motion.div>

              {/* Recents */}
              <div className="recent">
                <p className="recent-title">Recent</p>
                {allSessions.map((session, i) => (
                  <motion.div
                    key={session.id || i}
                    className="recent-entry"
                    onClick={() => handleSessionClick(session)}
                    whileHover={{ scale: 1.03 }}
                  >
                    <img src={assets.message_icon} alt="chat" />
                    <p>
                      {(session.chat.find(msg => msg.role === "user")?.prompt || "New Session").slice(0, 20)}
                      ...
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Section (Visible only when isContentVisible is true) */}
        {isContentVisible && (
          <motion.div
            className="bottom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default Sidebar;