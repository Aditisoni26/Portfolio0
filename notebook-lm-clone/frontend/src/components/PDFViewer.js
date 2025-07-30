import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, RotateCw } from 'lucide-react';
import './PDFViewer.css';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ document, currentPage, onPageChange }) => {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);

  const pdfUrl = `http://localhost:5000/uploads/${document.id}`;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    setError('Failed to load PDF');
    setLoading(false);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageInputChange = (e) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= numPages) {
      onPageChange(page);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetView = () => {
    setScale(1.0);
    setRotation(0);
  };

  return (
    <div className="pdf-viewer">
      <div className="pdf-header">
        <div className="document-info">
          <FileText size={20} />
          <span className="document-name">{document.filename}</span>
        </div>
        
        <div className="pdf-controls">
          <button 
            className="btn btn-secondary control-btn" 
            onClick={zoomOut}
            disabled={scale <= 0.5}
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          
          <span className="zoom-level">{Math.round(scale * 100)}%</span>
          
          <button 
            className="btn btn-secondary control-btn" 
            onClick={zoomIn}
            disabled={scale >= 3.0}
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          
          <button 
            className="btn btn-secondary control-btn" 
            onClick={rotate}
            title="Rotate"
          >
            <RotateCw size={16} />
          </button>
          
          <button 
            className="btn btn-secondary control-btn" 
            onClick={resetView}
            title="Reset View"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="pdf-navigation">
        <button 
          className="btn btn-secondary nav-btn" 
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        
        <div className="page-info">
          <input
            type="number"
            min="1"
            max={numPages || 1}
            value={currentPage}
            onChange={handlePageInputChange}
            className="page-input"
          />
          <span>of {numPages || '?'}</span>
        </div>
        
        <button 
          className="btn btn-secondary nav-btn" 
          onClick={goToNextPage}
          disabled={currentPage >= numPages}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="pdf-content">
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading PDF...</p>
          </div>
        )}
        
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="loading">Loading PDF...</div>}
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              rotate={rotation}
              loading={<div className="loading">Loading page...</div>}
            />
          </Document>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;