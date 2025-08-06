// src/App.jsx
import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const styles = ['style1.css', 'style2.css', 'style3.css'];

function App() {
  const uiRef = useRef(null);

  const [name, setName] = useState('Your Name');
  const [activeTab, setActiveTab] = useState('Home');
  const [styleIndex, setStyleIndex] = useState(0);
  const [tabs, setTabs] = useState(['Home', 'About', 'Education', 'Hobbies', 'Contact']);
  const [tabContent, setTabContent] = useState({
    Home: '',
    About: '',
    Education: '',
    Hobbies: '',
    Contact: ''
  });
  const [profilePic, setProfilePic] = useState(null);

  const handleStyleChange = (event) => {
    const next = parseInt(event.target.value);
    setStyleIndex(next);
    const link = document.getElementById('theme-style');
    if (link) link.href = `/styles/${styles[next]}`;
  };

  const handleAddSection = () => {
    const newSection = prompt('Enter new section name');
    if (newSection && !tabs.includes(newSection)) {
      setTabs([...tabs, newSection]);
      setTabContent({ ...tabContent, [newSection]: '' });
    }
  };

  const handleRenameSection = () => {
    const newName = prompt(`Rename section '${activeTab}' to:`);
    if (newName && !tabs.includes(newName)) {
      const newTabs = tabs.map(t => t === activeTab ? newName : t);
      const newTabContent = { ...tabContent };
      newTabContent[newName] = newTabContent[activeTab];
      delete newTabContent[activeTab];
      setTabs(newTabs);
      setTabContent(newTabContent);
      setActiveTab(newName);
    } else if (tabs.includes(newName)) {
      alert('Section with this name already exists.');
    }
  };

  const handleDeleteSection = () => {
    if (tabs.length === 1) {
      alert("Cannot delete the last remaining section.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete '${activeTab}' section?`)) {
      const newTabs = tabs.filter(t => t !== activeTab);
      const newTabContent = { ...tabContent };
      delete newTabContent[activeTab];
      setTabs(newTabs);
      setTabContent(newTabContent);
      setActiveTab(newTabs[0]);
    }
  };

  const handleContentChange = (e) => {
    setTabContent({ ...tabContent, [activeTab]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  const handleDownloadPage = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const originalTab = activeTab;

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      setActiveTab(tab);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(uiRef.current, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgProps = pdf.getImageProperties(imgData);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (imgProps.height * pageWidth) / imgProps.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
    }

    setActiveTab(originalTab);
    pdf.save(`${name.replace(/\s+/g, '_')}_portfolio.pdf`);
  };

  return (
    <div className="main-container">
      <div className="navbar">
        <select onChange={handleStyleChange} value={styleIndex}>
          <option value="0">Classic</option>
          <option value="1">Dandellion</option>
          <option value="2">Style 3</option>
        </select>
        <button onClick={handleAddSection}>Add Section</button>
        <button onClick={handleRenameSection}>Rename Section</button>
        <button onClick={handleDeleteSection}>Delete Section</button>
        <button onClick={handleDownloadPage}>Download Page</button>
      </div>

      <div className="ui-container" id="ui-box" ref={uiRef}>
        <div className="sidebar">
          <div
            className="profile-pic"
            style={{
              backgroundImage: profilePic ? `url(${profilePic})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '50%',
              width: '100px',
              height: '100px',
              border: '2px solid #ccc',
              marginBottom: '10px'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="profile-upload" style={{
              background: '#7d7d7fff',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              textAlign: 'center'
            }}>
              Choose File
            </label>
          </div>

          <input
            className="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="nav-buttons">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('tabIndex', idx);
                }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  const fromIdx = Number(e.dataTransfer.getData('tabIndex'));
                  if (fromIdx === idx) return;
                  const newTabs = [...tabs];
                  const [moved] = newTabs.splice(fromIdx, 1);
                  newTabs.splice(idx, 0, moved);
                  setTabs(newTabs);
                }}
                style={{ cursor: 'move' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="content-panel">
          <h1>{activeTab}</h1>
          <textarea
            value={tabContent[activeTab] || ''}
            onChange={handleContentChange}
            placeholder={`Enter content for ${activeTab}`}
            style={{
              width: '100%',
              height: '600px',
              resize: 'vertical',
              outline: 'none',
              border: 'none',
              background: 'transparent',
              color: 'inherit',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
