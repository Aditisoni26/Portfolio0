import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import './PDFUpload.css';

const PDFUpload = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(`Successfully uploaded ${response.data.filename}`);
        onUpload({
          id: response.data.documentId,
          filename: response.data.filename,
          pageCount: response.data.pageCount,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="pdf-upload">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          {uploading ? (
            <>
              <div className="upload-spinner"></div>
              <h3>Uploading and processing PDF...</h3>
              <p>Please wait while we extract the content from your document.</p>
            </>
          ) : (
            <>
              <Upload size={48} className="upload-icon" />
              <h3>Upload PDF to start chatting</h3>
              <p>Click or drag and drop your PDF file here</p>
              <div className="upload-specs">
                <span>• PDF files only</span>
                <span>• Max file size: 50MB</span>
              </div>
              <button className="btn btn-primary upload-button">
                <FileText size={20} />
                Choose PDF File
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="error">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="success">
          <CheckCircle size={20} />
          {success}
        </div>
      )}
    </div>
  );
};

export default PDFUpload;