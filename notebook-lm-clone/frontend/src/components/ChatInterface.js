import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, MessageCircle, ExternalLink, User, Bot, Loader } from 'lucide-react';
import './ChatInterface.css';

const ChatInterface = ({ document, onCitationClick }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello! I'm ready to help you with questions about "${document.filename}". What would you like to know?`,
      timestamp: new Date().toISOString(),
      citations: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      citations: []
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:5000/api/chat/${document.id}`, {
        message: userMessage.content
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.response,
        timestamp: response.data.timestamp,
        citations: response.data.citations || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date().toISOString(),
        citations: [],
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleCitationClick = (citation) => {
    onCitationClick(citation.page);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const suggestedQuestions = [
    "What is this document about?",
    "What are the main skills mentioned?",
    "What is the education background?",
    "What is the work experience?",
    "Summarize the key points"
  ];

  const handleSuggestedQuestion = (question) => {
    if (!isLoading) {
      setInputValue(question);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-title">
          <MessageCircle size={20} />
          <span>Chat with Document</span>
        </div>
        <div className="document-badge">
          {document.filename}
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 1 && (
          <div className="suggested-questions">
            <h4>Try asking:</h4>
            <div className="suggestions">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="suggestion-btn"
                  onClick={() => handleSuggestedQuestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="message-content">
                <div className={`message-bubble ${message.isError ? 'error' : ''}`}>
                  {message.content}
                </div>
                <div className="message-footer">
                  <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                  {message.citations && message.citations.length > 0 && (
                    <div className="citations">
                      {message.citations.map((citation, index) => (
                        <button
                          key={index}
                          className="citation-btn"
                          onClick={() => handleCitationClick(citation)}
                          title={citation.text}
                        >
                          <ExternalLink size={12} />
                          Page {citation.page}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot">
              <div className="message-avatar">
                <Bot size={16} />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <Loader size={16} className="spinning" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about the document..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!inputValue.trim() || isLoading}
            title="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;