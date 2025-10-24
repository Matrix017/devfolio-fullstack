const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Data file for demo contact messages
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Ensure data dir + file exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, '[]', 'utf8');

// Sample projects (returned by API)
const projects = [
  {
    id: 1,
    title: "Smart Inventory",
    desc: "Inventory management web app — React + Node API",
    img: "/assets/project1.jpg",
    live: "#",
    code: "#"
  },
  {
    id: 2,
    title: "Marketing Site",
    desc: "Landing page & CMS integration for a local business",
    img: "/assets/project2.jpg",
    live: "#",
    code: "#"
  },
  {
    id: 3,
    title: "Admin Portal",
    desc: "Internal admin tools with charts and reporting",
    img: "/assets/project3.jpg",
    live: "#",
    code: "#"
  }
];

// API: get projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// API: contact (saves to messages.json)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'name, email and message are required' });
  }

  const entry = {
    id: Date.now(),
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  };

  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    arr.push(entry);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(arr, null, 2), 'utf8');
    return res.json({ ok: true, entry });
  } catch (err) {
    console.error('Failed to save message', err);
    return res.status(500).json({ ok: false, error: 'failed to save message' });
  }
});

// Serve frontend static files from /public
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// SPA fallback — serve index.html for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ DevFolio server running: http://localhost:${PORT}`);
});
