import React, { useContext, useState, useEffect, useRef } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { AppContext } from '../../Context/Context';
import { runCoherePrompt } from '../../Config/cohere';

export const Main = () => {
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const { chatHistory, setChatHistory, saveSession } = useContext(AppContext);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const newUserMsg = { role: 'user', prompt };
    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);
    setIsTyping(true);

    const reply = await runCoherePrompt(prompt);

    const newBotMsg = {
      role: 'assistant',
      response: reply || '⚠️ Sorry, no response received.',
    };

    const newChat = [...updatedHistory, newBotMsg];
    setChatHistory(newChat);
    setIsTyping(false);
    setPrompt('');
    saveSession(newChat);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser doesn't support voice input.");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setPrompt((prev) => prev + ' ' + transcript);
    };
    recognition.start();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrompt((prev) => `${prev} [File uploaded: ${file.name}]`);
    }
  };

  return (
    <div className="Main">
      <div className="nav">
        <p>Comrade AI</p>
        <img src={assets.user_icon} alt="user" />
      </div>

      <div className="Main-container">
        <div className="greet">
          <p><span>Hey, User.</span></p>
          <p>How can I help you today?</p>
        </div>

        <div className="chat-container" ref={chatContainerRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
              {msg.role === 'user' ? msg.prompt : msg.response}
            </div>
          ))}
          {isTyping && <div className="chat-bubble ai typing">Typing...</div>}
        </div>

        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter a prompt here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <label htmlFor="file-upload">
              <img src={assets.gallery_icon} alt="Upload" />
            </label>
            <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />

            <img src={assets.mic_icon} alt="Mic" onClick={startListening} />
            <img src={assets.send_icon} alt="Send" onClick={handleSend} />
          </div>

          <p className="bottom-info">
            ⚠️ Cohere AI may not always be accurate. Double-check important facts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
