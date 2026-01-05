import React, { useState, useEffect } from 'react';

const ThemeSelector = ({ selectedTheme, onThemeSelect }) => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🎨 Fetching themes from backend...');
      
      const response = await fetch('http://localhost:5000/api/themes', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Themes response:', data);
      
      if (data && Array.isArray(data.themes)) {
        if (data.themes.length > 0) {
          setThemes(data.themes);
          console.log(`✅ Loaded ${data.themes.length} themes`);
        } else {
          setError('Backend returned empty themes array');
        }
      } else {
        console.error('❌ Invalid themes data format:', data);
        setError('Invalid theme data format from server');
      }
    } catch (error) {
      console.error('❌ Failed to load themes:', error);
      
      if (error.message.includes('Failed to fetch')) {
        setError('Cannot connect to backend. Is Flask running on port 5000?');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Theme descriptions for display
  const themeDescriptions = {
    'modern_blue': 'Professional blue theme for corporate presentations',
    'corporate_gray': 'Classic gray theme for business meetings',
    'creative_green': 'Fresh green theme for creative projects',
    'elegant_purple': 'Sophisticated purple for elegant presentations',
    'vibrant_orange': 'Energetic orange for dynamic content',
    'minimalist_black': 'Modern dark theme with high contrast',
    'soft_pink': 'Gentle pink for friendly presentations',
    'cool_teal': 'Calm teal for professional content',
    'warm_brown': 'Earthy brown for organic presentations'
  };

  if (loading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#667eea',
        fontSize: '16px'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '15px' }}>🎨</div>
        Loading themes...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '30px',
        backgroundColor: '#fee',
        border: '2px solid #fcc',
        borderRadius: '8px',
        color: '#c00',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚠️</div>
        <strong>Failed to Load Themes</strong>
        <p style={{ marginTop: '10px', fontSize: '14px' }}>{error}</p>
        <button
          onClick={fetchThemes}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          🔄 Retry
        </button>
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '6px',
          fontSize: '13px',
          textAlign: 'left'
        }}>
          <strong>Troubleshooting:</strong>
          <ol style={{ marginTop: '10px', paddingLeft: '20px' }}>
            <li>Make sure Flask backend is running on port 5000</li>
            <li>Check terminal for "Running on http://localhost:5000"</li>
            <li>Test: Open <code>http://localhost:5000/api/themes</code> in browser</li>
            <li>Check browser console (F12) for CORS errors</li>
          </ol>
        </div>
      </div>
    );
  }

  if (themes.length === 0) {
    return (
      <div style={{
        padding: '30px',
        textAlign: 'center',
        color: '#666',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        border: '2px dashed #ddd'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '15px' }}>📭</div>
        No themes available
        <button
          onClick={fetchThemes}
          style={{
            display: 'block',
            margin: '15px auto 0',
            padding: '10px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🔄 Reload
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, color: '#333' }}>
          🎨 Select Presentation Theme
        </h3>
        <span style={{ fontSize: '13px', color: '#666' }}>
          {themes.length} themes available
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => onThemeSelect(theme.id)}
            style={{
              border: selectedTheme === theme.id ? '3px solid #667eea' : '2px solid #e0e0e0',
              borderRadius: '12px',
              padding: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: selectedTheme === theme.id ? '#f0f4ff' : 'white',
              position: 'relative',
              boxShadow: selectedTheme === theme.id 
                ? '0 5px 20px rgba(102, 126, 234, 0.3)' 
                : '0 2px 8px rgba(0,0,0,0.1)',
              transform: selectedTheme === theme.id ? 'translateY(-2px)' : 'none'
            }}
          >
            {/* Color Preview */}
            <div style={{
              height: '100px',
              backgroundColor: theme.preview_color || '#eee',
              borderRadius: '8px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Mini slide preview */}
              <div style={{
                width: '80%',
                height: '70%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{
                  height: '20%',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  borderRadius: '2px'
                }}></div>
                <div style={{
                  height: '15%',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: '2px',
                  width: '70%'
                }}></div>
                <div style={{
                  height: '15%',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  borderRadius: '2px',
                  width: '85%'
                }}></div>
              </div>
            </div>

            {/* Theme Info */}
            <div>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                color: '#333',
                fontWeight: '600'
              }}>
                {theme.name || 'Unnamed Theme'}
              </h4>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#666',
                lineHeight: '1.4'
              }}>
                {theme.description || themeDescriptions[theme.id] || 'Custom theme'}
              </p>
            </div>

            {/* Selected Indicator */}
            {selectedTheme === theme.id && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#667eea',
                color: 'white',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}>
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Example usage
export default function App() {
  const [selectedTheme, setSelectedTheme] = useState('modern_blue');
  
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#333',
          marginBottom: '30px',
          fontSize: '32px'
        }}>
          🎯 Professional PPT Generator
        </h1>
        
        <ThemeSelector 
          selectedTheme={selectedTheme} 
          onThemeSelect={setSelectedTheme} 
        />
        
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f0f4ff',
          borderRadius: '8px',
          border: '2px solid #667eea'
        }}>
          <strong>Selected Theme:</strong> {selectedTheme}
        </div>
      </div>
    </div>
  );
}