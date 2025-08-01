// src/App.jsx
import { useState } from 'react';

const styles = ['style1.css', 'style2.css', 'style3.css'];

function App() {
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

  const handleStyleChange = (event) => {
    const next = parseInt(event.target.value);
    setStyleIndex(next);
    const link = document.getElementById('theme-style');
    link.href = `/styles/${styles[next]}`;
  };



  const handleAddSection = () => {
    const newSection = prompt('Enter new section name');
    if (newSection && !tabs.includes(newSection)) {
      setTabs([...tabs, newSection]);
      setTabContent({ ...tabContent, [newSection]: '' });
    }
  };

  const handleContentChange = (e) => {
    setTabContent({ ...tabContent, [activeTab]: e.target.value });
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
      </div>

      <div className="ui-container" id="ui-box">
        <div className="sidebar">
          <div className="profile-pic" />
          <input
            className="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="nav-buttons">
            {tabs.map(tab => (
              <button
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
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
              height: '200px',
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
