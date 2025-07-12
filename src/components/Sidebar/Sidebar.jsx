import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { AppContext } from "../../Context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { chatHistory, setChatHistory, allSessions, saveSession } = useContext(AppContext);

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
  };

  const handleSettings = () => {
    alert("⚙️ Settings: Coming soon!");
  };

  return (
    <div className={`Sidebar ${extended ? "expanded" : ""}`}>
      <div className="top">
        <img
          onClick={() => setExtended(prev => !prev)}
          className="menu"
          src={assets.menu_icon}
          alt="menu"
        />

        <div className="new-chat" onClick={handleNewChat}>
          <img src={assets.plus_icon} alt="new chat" />
          {extended && <p>New Chat</p>}
        </div>

        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {allSessions.map((session, i) => (
              <div key={session.id} className="recent-entry">
                <img src={assets.message_icon} alt="chat" />
                <p>
                  {(session.chat.find(msg => msg.role === "user")?.prompt || "Empty")
                    .slice(0, 30)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry" onClick={handleHelp}>
          <img src={assets.question_icon} alt="Help" />
          {extended && <p>Help</p>}
        </div>
        <div className="bottom-item recent-entry" onClick={handleActivity}>
          <img src={assets.history_icon} alt="Activity" />
          {extended && <p>Activity</p>}
        </div>
        <div className="bottom-item recent-entry" onClick={handleSettings}>
          <img src={assets.setting_icon} alt="Settings" />
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
