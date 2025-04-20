// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiDownload, FiSettings, FiRefreshCw, FiSun, FiMoon } from 'react-icons/fi';
import './App.css';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    size: '512x512',
    style: 'realistic',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  const galleryRef = useRef(null);

  // Mock function to generate AI images (replace with actual API)
  const generateImages = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newImages = [
        {
          id: Date.now(),
          url: `/api/placeholder/512/512`,
          prompt,
          date: new Date().toISOString(),
        },
        {
          id: Date.now() + 1,
          url: `/api/placeholder/512/512`,
          prompt,
          date: new Date().toISOString(),
        }
      ];
      
      setImages(prevImages => [...newImages, ...prevImages]);
      setLoading(false);
    }, 2000);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      generateImages();
    }
  };
  
  const handleStyleChange = (style) => {
    setSettings({ ...settings, style });
  };
  
  const handleSizeChange = (size) => {
    setSettings({ ...settings, size });
  };
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  return (
    <div className={`app-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <header className="header">
        <div className="logo">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="logo-icon"
          >
            <FiImage />
          </motion.div>
          <h1>DreamCanvas</h1>
        </div>
        <motion.button 
          className="theme-toggle"
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </motion.button>
      </header>

      <main className="main">
        <section className="generator-section">
          <motion.div 
            className="prompt-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Create Your Imagination</h2>
            <div className="input-group">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the image you want to create..."
                className="prompt-input"
              />
              <motion.button 
                onClick={() => generateImages()}
                disabled={loading || !prompt.trim()}
                className="generate-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? <FiRefreshCw className="spinning" /> : 'Generate'}
              </motion.button>
              <motion.button 
                className="settings-btn"
                onClick={() => setShowSettings(!showSettings)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSettings />
              </motion.button>
            </div>

            <AnimatePresence>
              {showSettings && (
                <motion.div 
                  className="settings-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="settings-group">
                    <label>Style:</label>
                    <div className="style-options">
                      {['realistic', 'artistic', 'anime', 'abstract'].map(style => (
                        <button 
                          key={style}
                          className={`style-btn ${settings.style === style ? 'active' : ''}`}
                          onClick={() => handleStyleChange(style)}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="settings-group">
                    <label>Size:</label>
                    <div className="size-options">
                      {['256x256', '512x512', '1024x1024'].map(size => (
                        <button 
                          key={size}
                          className={`size-btn ${settings.size === size ? 'active' : ''}`}
                          onClick={() => handleSizeChange(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="gallery-section" ref={galleryRef}>
          <h2>Your Creations</h2>
          <div className="gallery-container">
            <AnimatePresence>
              {loading && (
                <motion.div 
                  className="loading-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="loading-spinner"></div>
                  <p>Creating your masterpiece...</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="gallery-grid">
              {images.length > 0 ? (
                images.map((image, index) => (
                  <motion.div 
                    className="image-card"
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
                    }}
                  >
                    <div className="image-container">
                      <img src={image.url} alt={image.prompt} />
                      <div className="image-overlay">
                        <motion.button 
                          className="download-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiDownload />
                        </motion.button>
                      </div>
                    </div>
                    <div className="image-info">
                      <p className="image-prompt">{image.prompt}</p>
                      <p className="image-date">{new Date(image.date).toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-gallery">
                  <p>Your generated images will appear here</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <div className="footer-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="currentColor" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,218.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <p>Created with ❤️ | DreamCanvas AI Generator</p>
      </footer>
    </div>
  );
};

export default App;