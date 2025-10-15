import React, { useState, useEffect } from 'react';
import './BrandLogoManager.css';

/**
 * Brand Logo Manager Component
 * Admin widget for uploading and managing brand logos
 * Stores logos in localStorage for persistence
 */
const BrandLogoManager = ({ onClose }) => {
  const [brands, setBrands] = useState({});
  const [selectedBrand, setSelectedBrand] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [showAddBrand, setShowAddBrand] = useState(false);

  // Common brand names (can be extended)
  const defaultBrands = [
    'Shell', 'BP', '7-Eleven', 'Mobil', 'Coles Express', 
    'Caltex', 'Ampol', 'United', 'Liberty', 'Metro', 
    'Puma', 'Vibe', 'Independent'
  ];

  // Load saved brand logos from localStorage
  useEffect(() => {
    const savedLogos = localStorage.getItem('brandLogos');
    if (savedLogos) {
      try {
        setBrands(JSON.parse(savedLogos));
      } catch (error) {
        console.error('Error loading brand logos:', error);
      }
    }
  }, []);

  // Save brand logos to localStorage
  const saveBrands = (updatedBrands) => {
    localStorage.setItem('brandLogos', JSON.stringify(updatedBrands));
    setBrands(updatedBrands);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, SVG)');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      setUploadedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload logo for selected brand
  const handleUpload = () => {
    if (!selectedBrand) {
      alert('Please select a brand');
      return;
    }

    if (!previewUrl) {
      alert('Please select an image file');
      return;
    }

    // Save the base64 image data
    const updatedBrands = {
      ...brands,
      [selectedBrand]: previewUrl
    };

    saveBrands(updatedBrands);
    
    // Reset form
    setUploadedFile(null);
    setPreviewUrl('');
    setSelectedBrand('');
    
    alert(`Logo uploaded successfully for ${selectedBrand}!`);
  };

  // Add new brand
  const handleAddBrand = () => {
    if (!newBrandName.trim()) {
      alert('Please enter a brand name');
      return;
    }

    if (defaultBrands.includes(newBrandName) || brands[newBrandName]) {
      alert('This brand already exists');
      return;
    }

    setSelectedBrand(newBrandName);
    setShowAddBrand(false);
    setNewBrandName('');
  };

  // Delete brand logo
  const handleDelete = (brandName) => {
    if (window.confirm(`Delete logo for ${brandName}?`)) {
      const updatedBrands = { ...brands };
      delete updatedBrands[brandName];
      saveBrands(updatedBrands);
    }
  };

  // Export logos as JSON (for backup)
  const handleExport = () => {
    const dataStr = JSON.stringify(brands, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'brand-logos-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get all available brands (defaults + custom)
  const allBrands = [...new Set([...defaultBrands, ...Object.keys(brands)])].sort();

  return (
    <div className="brand-logo-manager-overlay">
      <div className="brand-logo-manager">
        <div className="manager-header">
          <h2>🎨 Brand Logo Manager</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close">×</button>
        </div>

        <div className="manager-content">
          {/* Upload Section */}
          <div className="upload-section">
            <h3>Upload Brand Logo</h3>
            
            <div className="form-group">
              <label htmlFor="brand-select">Select Brand</label>
              <div className="brand-select-group">
                <select
                  id="brand-select"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="brand-select"
                >
                  <option value="">Choose a brand...</option>
                  {allBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <button 
                  onClick={() => setShowAddBrand(true)}
                  className="add-brand-btn"
                  title="Add new brand"
                >
                  +
                </button>
              </div>
            </div>

            {showAddBrand && (
              <div className="add-brand-form">
                <input
                  type="text"
                  placeholder="Enter new brand name"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="brand-input"
                />
                <div className="add-brand-actions">
                  <button onClick={handleAddBrand} className="btn-primary">Add</button>
                  <button onClick={() => {
                    setShowAddBrand(false);
                    setNewBrandName('');
                  }} className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="logo-upload">Upload Logo Image</label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
              />
              <p className="help-text">
                Recommended: PNG or SVG, transparent background, max 2MB
              </p>
            </div>

            {previewUrl && (
              <div className="preview-section">
                <h4>Preview</h4>
                <div className="preview-box">
                  <img src={previewUrl} alt="Logo preview" className="preview-image" />
                </div>
              </div>
            )}

            <button 
              onClick={handleUpload} 
              className="upload-btn"
              disabled={!selectedBrand || !previewUrl}
            >
              Upload Logo
            </button>
          </div>

          {/* Existing Logos Section */}
          <div className="existing-logos-section">
            <div className="section-header">
              <h3>Uploaded Logos ({Object.keys(brands).length})</h3>
              {Object.keys(brands).length > 0 && (
                <button onClick={handleExport} className="export-btn">
                  💾 Export Backup
                </button>
              )}
            </div>

            {Object.keys(brands).length === 0 ? (
              <div className="empty-state">
                <p>No logos uploaded yet</p>
                <p className="help-text">Upload your first brand logo above</p>
              </div>
            ) : (
              <div className="logos-grid">
                {Object.entries(brands).map(([brandName, logoUrl]) => (
                  <div key={brandName} className="logo-card">
                    <div className="logo-card-image">
                      <img src={logoUrl} alt={`${brandName} logo`} />
                    </div>
                    <div className="logo-card-info">
                      <h4>{brandName}</h4>
                      <button 
                        onClick={() => handleDelete(brandName)}
                        className="delete-btn"
                        aria-label={`Delete ${brandName} logo`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="manager-footer">
          <p className="info-text">
            ℹ️ Logos are stored in your browser's local storage. Export regularly for backup.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandLogoManager;

