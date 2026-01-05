// src/components/ContentGen.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiSend, FiMic, FiPlus, FiLoader, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../styles/ContentGen.css";


export default function ContentGen() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("Quick Response");
  const [isTyping, setIsTyping] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const modes = [
    { key: "Quick Response", label: "⚡ Quick Response" },
    { key: "Detailed", label: "📋 Detailed" },
    { key: "Creative", label: "🎨 Creative" }
  ];

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const generate = async (promptText, promptMode) => {
    setOutput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText, mode: promptMode })
      });
      const raw = await res.text();
      if (!raw) throw new Error("Empty response");
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(raw);
      }
      setOutput(data.output || "[No output]");
    } catch (err) {
      setOutput(`[Error]: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendText = () => {
    const prompt = text.trim();
    if (!prompt) return;
    setIsTyping(true);
    generate(prompt, mode).finally(() => setIsTyping(false));
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };

  const toggleDropdown = () => setDropdownOpen((o) => !o);
  const selectMode = (key) => {
    setMode(key);
    setDropdownOpen(false);
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="cge-container">
      {/* Back Button */}
      <div className="cge-header">
        <button className="cge-back-button" onClick={goHome} title="Go back to Home">
          <FiArrowLeft size={18} />
          Back to Home
        </button>
      </div>

      <div className="cge-editor">
        <textarea
          ref={textareaRef}
          className="cge-textarea"
          rows={5}
          value={text}
          placeholder="Write your vision..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="cge-footer">
          <div className="cge-dropdown">
            <button className="cge-dd-toggle" onClick={toggleDropdown}>
              {modes.find((m) => m.key === mode).label}
            </button>
            {dropdownOpen && (
              <ul className="cge-dd-menu">
                {modes.map(({ key, label }) => (
                  <li
                    key={key}
                    className="cge-dd-item"
                    onClick={() => selectMode(key)}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="cge-buttons">
            {isTyping && (
              <div className="cge-loading">
                <FiLoader className="cge-spinner" />
                Generating...
              </div>
            )}
            <button className="cge-icon" disabled title="Add attachment">
              <FiPlus />
            </button>
            <button className="cge-icon" disabled title="Voice input">
              <FiMic />
            </button>
            <button
              className="cge-submit"
              onClick={sendText}
              disabled={!text.trim() || loading}
            >
              <FiSend />
              Generate
            </button>
          </div>
        </div>
      </div>
      <div className="cge-output">
        {loading ? (
          <div className="cge-output-loading">
            <FiLoader className="cge-spinner" />
            Generating content...
          </div>
        ) : output ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
        ) : (
          <p className="cge-placeholder">Ready to generate amazing content...</p>
        )}
      </div>
      <button
        onClick={() => {
          if (output.trim()) {
            navigate("/PPTGenerator", { state: { generatedContent: output } });
          } else {
            alert("Please generate content first!");
          }
        }}
        className="gen-ppt-btn" 
      >Generate PPT...</button>
    </div>
  );
}
