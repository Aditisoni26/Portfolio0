# NotebookLM Clone

A web-based application that enables users to upload and interact with PDF documents through a chat interface, similar to Google's NotebookLM. Built with React frontend and Node.js/Express backend.

## Features

### ✨ Core Functionality
- **PDF Upload**: Drag-and-drop or click to upload PDF files (up to 50MB)
- **PDF Viewer**: Built-in PDF viewer with navigation, zoom, rotation controls
- **Chat Interface**: Interactive chat to ask questions about uploaded documents
- **Citations**: Click citation buttons to navigate to specific PDF pages
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🛠 Technical Features
- PDF content extraction using pdf-parse
- Real-time chat interface with typing indicators
- Modern, clean UI inspired by Google's design language
- RESTful API architecture
- Error handling and loading states
- Cross-platform compatibility

## Technology Stack

### Frontend
- **React** - UI framework
- **react-pdf** - PDF viewing capabilities
- **lucide-react** - Modern icon set
- **axios** - HTTP client for API calls
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **pdf-parse** - PDF content extraction
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone/Extract the project**
   ```bash
   # Extract the zip file and navigate to the project directory
   cd notebook-lm-clone
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Backend Server**
   ```bash
   cd ../backend
   npm run dev
   ```
   The backend will start on `http://localhost:5000`

5. **Start the Frontend Server** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```
   The frontend will start on `http://localhost:3000`

6. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### Uploading a PDF
1. Open the application in your browser
2. Drag and drop a PDF file onto the upload area, or click to browse
3. Wait for the file to upload and process (you'll see a progress indicator)
4. Once uploaded, you'll see the PDF viewer and chat interface

### Viewing PDFs
- **Navigation**: Use Previous/Next buttons or enter a specific page number
- **Zoom**: Use zoom in/out buttons or the zoom percentage display
- **Rotate**: Rotate the PDF 90 degrees at a time
- **Reset**: Return to original view settings

### Chatting with Documents
1. Type your question in the chat input at the bottom
2. Press Enter or click the send button
3. The AI will analyze the document and provide relevant answers
4. Click citation buttons (e.g., "Page 1") to jump to referenced content
5. Use suggested questions for quick starts

### Example Questions
- "What is this document about?"
- "What are the main skills mentioned?"
- "Summarize the key points"
- "What is the education background?"
- "What work experience is listed?"

## API Documentation

### Endpoints

#### Upload PDF
```
POST /api/upload
```
- **Content-Type**: multipart/form-data
- **Body**: PDF file in 'pdf' field
- **Response**: Document metadata including ID and page count

#### Get Document Info
```
GET /api/document/:id
```
- **Response**: Document details (filename, page count, upload date)

#### Chat with Document
```
POST /api/chat/:documentId
```
- **Body**: `{ "message": "Your question here" }`
- **Response**: AI response with citations

#### Health Check
```
GET /api/health
```
- **Response**: Server status

## Project Structure

```
notebook-lm-clone/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── PDFUpload.js       # File upload component
│   │   │   ├── PDFUpload.css      # Upload styling
│   │   │   ├── PDFViewer.js       # PDF display component
│   │   │   ├── PDFViewer.css      # Viewer styling
│   │   │   ├── ChatInterface.js   # Chat component
│   │   │   └── ChatInterface.css  # Chat styling
│   │   ├── App.js           # Main application component
│   │   ├── App.css          # Global styles
│   │   └── index.js         # Application entry point
│   ├── package.json         # Frontend dependencies
│   └── ...
├── backend/                 # Node.js backend server
│   ├── server.js           # Main server file
│   ├── uploads/            # Uploaded PDF storage
│   ├── package.json        # Backend dependencies
│   └── ...
└── README.md               # This file
```

## Configuration

### Environment Variables (Backend)
Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
```

### Frontend Configuration
The frontend is configured to connect to the backend at `http://localhost:5000`. To change this:

1. Update the API base URL in the frontend components
2. Or use environment variables with `REACT_APP_` prefix

## Performance Optimizations

- **File Size Limits**: 50MB maximum PDF size
- **Memory Management**: Efficient PDF parsing and storage
- **Lazy Loading**: Components load as needed
- **Responsive Images**: PDF pages scale appropriately
- **Error Boundaries**: Graceful error handling

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Known Limitations

1. **AI Responses**: Currently uses mock responses for demonstration
2. **Storage**: Files stored locally (not suitable for production)
3. **Authentication**: No user authentication implemented
4. **Vectorization**: Basic text extraction (can be enhanced with RAG)

## Future Enhancements

### Planned Features
- [ ] Real AI integration (OpenAI, Anthropic, etc.)
- [ ] Advanced PDF vectorization with LlamaIndex
- [ ] User authentication and document management
- [ ] Cloud storage integration (AWS S3, Google Cloud)
- [ ] Multi-document chat capabilities
- [ ] Advanced search and filtering
- [ ] Document sharing and collaboration

### AI Integration Options
To integrate real AI capabilities:

1. **OpenAI Integration**
   ```bash
   npm install openai
   ```

2. **Anthropic Claude**
   ```bash
   npm install @anthropic-ai/sdk
   ```

3. **Local Models** (Ollama, etc.)
   ```bash
   npm install ollama
   ```

## Troubleshooting

### Common Issues

**PDF Not Loading**
- Check file size (must be < 50MB)
- Ensure file is a valid PDF
- Check browser console for errors

**Chat Not Working**
- Verify backend server is running on port 5000
- Check network connectivity
- Review browser console for API errors

**Styling Issues**
- Clear browser cache
- Ensure all CSS files are loading
- Check for console warnings

**Upload Fails**
- Check file permissions in backend/uploads directory
- Verify multer configuration
- Check disk space

### Development Tips
- Use browser dev tools to debug API calls
- Check backend console for server-side errors
- Ensure CORS is properly configured
- Test with different PDF types and sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google NotebookLM for inspiration
- React-PDF library for PDF viewing capabilities
- Lucide for beautiful icons
- The open-source community for various tools and libraries

## Support

For issues, questions, or contributions:
1. Check the troubleshooting section
2. Review existing issues
3. Create a detailed issue report
4. Include steps to reproduce any bugs

---

**Note**: This is a demonstration application. For production use, implement proper security measures, authentication, and error handling.