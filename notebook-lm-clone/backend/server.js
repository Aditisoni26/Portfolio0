const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Store document data in memory (in production, use a database)
const documents = new Map();

// Mock AI service for demonstration (replace with actual AI API)
const generateAIResponse = async (question, context) => {
    // This is a mock response. In production, you would use OpenAI, Anthropic, or another AI service
    const mockResponses = {
        "what is this document about": "This document appears to be a resume for Sagar Bhogavta, a full-stack web developer with experience in React, Angular, Node.js, and Next.js.",
        "what are the main skills": "The candidate has skills in JavaScript, Python, TypeScript, C#, React, Angular, Express.js, Flask, Django, Node.js, MongoDB, MySQL, NoSQL, AWS, Azure, Docker, Kubernetes, GitHub, Postman, and Datadog.",
        "what is the education background": "The candidate has a Post Graduate Certificate in Computer Applications Security from Conestoga College (May 2023 - Dec 2023) and a Post Graduate Certificate in Computer Applications Development from Conestoga College (May 2022 - April 2023).",
        "what is the work experience": "The candidate has worked as a Full-Stack Developer (Remote) at FoodReady, Chicago, USA (Jan 2024 - April 2024), Application Developer Intern at Covan Group, Waterloo, Ontario (Jan 2023 - April 2023), and Web Developer at Tetrad DigiTech, Rajkot, Gujarat (May 2021 - May 2022)."
    };
    
    const normalizedQuestion = question.toLowerCase();
    for (const [key, value] of Object.entries(mockResponses)) {
        if (normalizedQuestion.includes(key)) {
            return {
                answer: value,
                citations: [
                    { page: 1, text: "Relevant information found on page 1" }
                ]
            };
        }
    }
    
    return {
        answer: "I can help you with questions about this document. Try asking about the candidate's skills, education, or work experience.",
        citations: []
    };
};

// Routes
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath);
        
        // Parse PDF content
        const pdfData = await pdfParse(fileBuffer);
        
        // Store document data
        const documentId = req.file.filename;
        documents.set(documentId, {
            id: documentId,
            filename: req.file.originalname,
            filePath: filePath,
            content: pdfData.text,
            pageCount: pdfData.numpages,
            uploadDate: new Date()
        });

        res.json({
            success: true,
            documentId: documentId,
            filename: req.file.originalname,
            pageCount: pdfData.numpages,
            message: 'PDF uploaded and processed successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
});

app.get('/api/document/:id', (req, res) => {
    const documentId = req.params.id;
    const document = documents.get(documentId);
    
    if (!document) {
        return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json({
        id: document.id,
        filename: document.filename,
        pageCount: document.pageCount,
        uploadDate: document.uploadDate
    });
});

app.post('/api/chat/:documentId', async (req, res) => {
    try {
        const { documentId } = req.params;
        const { message } = req.body;
        
        const document = documents.get(documentId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        // Generate AI response
        const aiResponse = await generateAIResponse(message, document.content);
        
        res.json({
            response: aiResponse.answer,
            citations: aiResponse.citations,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});