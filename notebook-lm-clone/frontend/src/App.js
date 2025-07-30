import React, { useState } from 'react';
import './App.css';
import PDFUpload from './components/PDFUpload';
import PDFViewer from './components/PDFViewer';
import ChatInterface from './components/ChatInterface';
import { Upload } from 'lucide-react';

function App() {
  const [currentDocument, setCurrentDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDocumentUpload = (documentData) => {
    setCurrentDocument(documentData);
    setCurrentPage(1);
  };

  const handleCitationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <Upload size={24} />
            NotebookLM Clone
          </h1>
          <p className="app-subtitle">Upload PDFs and chat with your documents</p>
        </div>
      </header>

      <main className="app-main">
        {!currentDocument ? (
          <div className="upload-container">
            <PDFUpload onUpload={handleDocumentUpload} />
          </div>
        ) : (
          <div className="document-interface">
            <div className="pdf-section">
              <PDFViewer 
                document={currentDocument} 
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
            <div className="chat-section">
              <ChatInterface 
                document={currentDocument}
                onCitationClick={handleCitationClick}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
