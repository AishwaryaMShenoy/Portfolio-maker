// src/App.jsx
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const container = document.createElement('div');
      container.style.width = '800px';
      container.style.padding = '2rem';
      container.style.background = 'white';
      container.style.color = 'black';
      container.style.fontFamily = 'Arial';

      const heading = document.createElement('h1');
      heading.textContent = tab;
      container.appendChild(heading);

      if (i === 0 && profilePic) {
        const img = document.createElement('img');
        img.src = profilePic;
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        img.style.marginBottom = '1rem';
        container.appendChild(img);
      }

      const nameEl = document.createElement('p');
      nameEl.innerText = `Name: ${name}`;
      nameEl.style.fontWeight = 'bold';
      container.appendChild(nameEl);

      const content = document.createElement('p');
      content.innerHTML = (tabContent[tab] || '').replace(/\n/g, '<br/>');
      container.appendChild(content);

      document.body.appendChild(container);
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true
      });
      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

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
        <button onClick={handleDownloadPage}>Download Page</button>
      </div>

      <div className="ui-container" id="ui-box">
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

