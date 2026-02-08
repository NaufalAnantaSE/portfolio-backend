const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============== DATA ==============
const personalInfo = {
  id: "1",
  name: "Naufal Ananta",
  title: "Full Stack Developer",
  bio: "Passionate developer dengan pengalaman dalam membangun aplikasi web modern menggunakan React, Node.js, dan berbagai teknologi terkini.",
  email: "anantanaufal250@gmail.com",
  location: "Indonesia",
  avatar: "/avatar.jpg",
  socialMedia: {
    github: "https://github.com/NaufalAnantaSE",
    linkedin: "https://linkedin.com/in/naufalananta",
    twitter: "",
    instagram: ""
  },
  updatedAt: new Date().toISOString()
};

const techStacks = [
  { id: "1", name: "React", icon: "react", color: "#61DAFB", order: 1, isActive: true },
  { id: "2", name: "Node.js", icon: "nodejs", color: "#339933", order: 2, isActive: true },
  { id: "3", name: "TypeScript", icon: "typescript", color: "#3178C6", order: 3, isActive: true },
  { id: "4", name: "Next.js", icon: "nextjs", color: "#000000", order: 4, isActive: true },
  { id: "5", name: "Tailwind CSS", icon: "tailwindcss", color: "#06B6D4", order: 5, isActive: true },
  { id: "6", name: "PostgreSQL", icon: "postgresql", color: "#4169E1", order: 6, isActive: true },
  { id: "7", name: "MongoDB", icon: "mongodb", color: "#47A248", order: 7, isActive: true },
  { id: "8", name: "Docker", icon: "docker", color: "#2496ED", order: 8, isActive: true },
];

const projects = [
  {
    id: "1",
    title: "Portfolio Website",
    description: "Website portfolio personal dengan Astro.js dan AI chatbot",
    year: 2025,
    image: "/projects/portfolio.jpg",
    githubUrl: "https://github.com/NaufalAnantaSE/astro-portfolio",
    websiteUrl: "",
    alt: "Portfolio Website",
    status: "published",
    order: 1
  },
  {
    id: "2", 
    title: "Comparativo",
    description: "Aplikasi perbandingan performa gRPC vs REST API",
    year: 2026,
    image: "/projects/comparativo.jpg",
    githubUrl: "https://github.com/NaufalAnantaSE/comparativo",
    websiteUrl: "",
    alt: "Comparativo",
    status: "published",
    order: 2
  }
];

const seoSettings = {
  id: "1",
  siteTitle: "Naufal Ananta - Full Stack Developer",
  siteDescription: "Portfolio Naufal Ananta, Full Stack Developer dari Indonesia",
  keywords: ["developer", "fullstack", "react", "nodejs", "portfolio"],
  ogImage: "/og-image.jpg",
  twitterCard: "summary_large_image",
  favicon: "/favicon.ico",
  updatedAt: new Date().toISOString()
};

// ============== ROUTES ==============

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running' });
});

// Personal Info
app.get('/api/personal-info', (req, res) => {
  res.json(personalInfo);
});

// Tech Stacks
app.get('/api/tech-stacks', (req, res) => {
  res.json(techStacks.filter(t => t.isActive));
});

// Projects
app.get('/api/projects', (req, res) => {
  const { status, page = 1, limit = 10, all } = req.query;
  
  let filtered = projects;
  if (status && status !== 'all') {
    filtered = projects.filter(p => p.status === status);
  }
  
  if (all === 'true') {
    return res.json({ data: filtered, total: filtered.length });
  }
  
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + parseInt(limit));
  
  res.json({
    data: paginated,
    total: filtered.length,
    page: parseInt(page),
    limit: parseInt(limit)
  });
});

// SEO Settings
app.get('/api/seo-settings', (req, res) => {
  res.json(seoSettings);
});

// AI Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    
    const systemPrompt = `Kamu adalah AI Assistant untuk portfolio Naufal Ananta, seorang Full Stack Developer dari Indonesia.

Informasi tentang Naufal:
- Nama: Naufal Ananta
- Profesi: Full Stack Developer
- Skills: React, Node.js, TypeScript, Next.js, Astro.js, PostgreSQL, MongoDB, Docker
- Email: anantanaufal250@gmail.com
- GitHub: https://github.com/NaufalAnantaSE

Project yang pernah dikerjakan:
1. Portfolio Website - Website portfolio dengan Astro.js dan AI chatbot
2. Comparativo - Aplikasi perbandingan performa gRPC vs REST API
3. Eduline - Platform edukasi online

Jawab pertanyaan pengunjung dengan ramah, informatif, dan dalam Bahasa Indonesia. Jika ditanya hal di luar konteks portfolio, tetap jawab dengan sopan tapi arahkan kembali ke portfolio.`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model", 
          parts: [{ text: "Baik, saya siap membantu sebagai AI Assistant portfolio Naufal Ananta. Ada yang bisa saya bantu?" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      message: error.message || 'Internal Server Error',
      error: 'Internal Server Error',
      statusCode: 500
    });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
