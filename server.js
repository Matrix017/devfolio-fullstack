// server.js
import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url";

// Fix __dirname and __filename for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Data directory (for local testing)
const DATA_DIR = path.join(__dirname, "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(MESSAGES_FILE))
  fs.writeFileSync(MESSAGES_FILE, "[]", "utf8");

// Sample projects (for demo)
const projects = [
  {
    id: 1,
    title: "Smart Inventory",
    desc: "Inventory management web app — React + Node API",
    img: "/assets/project1.jpg",
    live: "#",
    code: "#",
  },
  {
    id: 2,
    title: "Marketing Site",
    desc: "Landing page & CMS integration for a local business",
    img: "/assets/project2.jpg",
    live: "#",
    code: "#",
  },
  {
    id: 3,
    title: "Admin Portal",
    desc: "Internal admin tools with charts and reporting",
    img: "/assets/project3.jpg",
    live: "#",
    code: "#",
  },
];

// API: fetch projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// API: save contact messages
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ ok: false, error: "All fields are required" });
  }

  const entry = {
    id: Date.now(),
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = fs.readFileSync(MESSAGES_FILE, "utf8");
    const arr = JSON.parse(raw || "[]");
    arr.push(entry);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(arr, null, 2), "utf8");
    res.json({ ok: true, entry });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ ok: false, error: "Server error saving message" });
  }
});

// Serve static files
const publicPath = path.join(__dirname, "src");
app.use(express.static(publicPath));

// SPA fallback (for frontend routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ DevFolio running at http://localhost:${PORT}`);
});

