import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';
import ThemeSelector from './ThemeSelector';
import '../styles/PPTGenerator.css';

const PPTGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const generatedContent = location.state?.generatedContent || "";

  const [fileName, setFileName] = useState("AI_Generated_Presentation");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('modern_blue');
  const [customizations, setCustomizations] = useState({
    font_size: 18,
    slide_count: 5,
    theme: 'modern_blue'
  });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setCustomizations(prev => ({ ...prev, theme: selectedTheme }));
  }, [selectedTheme]);

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
  };

  const handleCustomizationChange = (key, value) => {
    setCustomizations(prev => ({ ...prev, [key]: value }));
  };

  const handleGeneratePPT = async () => {
    if (!generatedContent) {
      alert('No content available for PPT generation!');
      return;
    }

    setIsGenerating(true);
    setStatus('generating');
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? prev : prev + Math.random() * 10));
    }, 300);

    try {
      const pptData = {
        content: generatedContent,
        title: fileName,
        filename: fileName,
        customizations: {
          ...customizations,
          theme: selectedTheme
        }
      };

      const response = await axios.post('http://localhost:5000/api/generate-ppt', pptData, {
        responseType: 'blob',
        timeout: 60000
      });

      setProgress(100);

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      });

      saveAs(blob, `${fileName}.pptx`);
      setStatus('success');

      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
      }, 3000);
    } catch (error) {
      console.error('PPT generation failed:', error);
      setStatus('error');
      alert('Failed to generate PPT. Please try again.');
    } finally {
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="ppt-generator">
      <div className="ppt-generator-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>Professional PPT Generator</h2>
      </div>

      <div className="generator-content">
        <div className="content-preview">
          <h3>Generated Content Preview</h3>
          <div className="content-box">
            <p>{generatedContent.substring(0,2000)}...</p>
          </div>
        </div>

        <div className="customization-section">
          <ThemeSelector selectedTheme={selectedTheme} onThemeSelect={handleThemeSelect} />

          <div className="advanced-options">
            <h3>Advanced Options</h3>

            <div className="form-group">
              <label>Font Size</label>
              <div className="range-input">
                <input
                  type="range"
                  min="14"
                  max="28"
                  value={customizations.font_size}
                  onChange={e => handleCustomizationChange('font_size', parseInt(e.target.value))}
                />
                <span>{customizations.font_size}px</span>
              </div>
            </div>

            <div className="form-group">
              <label>Number of Slides</label>
              <input
                type="number"
                min="3"
                max="15"
                value={customizations.slide_count}
                onChange={e => handleCustomizationChange('slide_count', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="generation-section">
          {status === 'generating' && (
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p>Creating your professional presentation... {Math.round(progress)}%</p>
            </div>
          )}

          <label htmlFor="ppt-filename">Enter PPT Filename:</label>
          <input
            id="ppt-filename"
            type="text"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            placeholder="File name without extension"
          />
          <button
            className="generate-ppt-btn"
            onClick={handleGeneratePPT}
            disabled={isGenerating || !generatedContent}
          >
            {isGenerating ? 'Generating Professional PPT...' : 'Generate Professional PPT'}
          </button>

          {status === 'success' && <div className="success-message">✅ Professional PPT generated successfully!</div>}
          {status === 'error' && <div className="error-message">❌ Generation failed. Please try again.</div>}
        </div>
      </div>
    </div>
  );
};

export default PPTGenerator;
