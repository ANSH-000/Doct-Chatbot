import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const messagesEndRef = useRef(null);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  console.log(process.env)
  const handleSend = async () => {
    if (!input.trim()) return;

    const modifiedInput = selectedFeature ? `mode:${selectedFeature} query:${input}` : input;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.REACT_APP_API_KEY;



      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        { contents: [{ parts: [{ text: `Short answer, plain text, act like u are a  doctor providing medical advice chat bot named Doct Chatbot (kind of a counsellor) Your responses should be informative, empathetic, and tailored to the patient's symptoms and concerns. Incorporate professional medical knowledge and suggest potential treatments or further actions based on the symptoms described by the patient.Summarize prior messages: User prefers a formal communication style and is interested in prompts that provide the cause of a situation and home remedies, Query: ${modifiedInput}` }] }] },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const botMessage = {
        sender: 'bot',
        text: response.data.candidates[0].content.parts[0].text
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Failed to fetch data. Please try again.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="container">
      <div className="side left">
        <div className="center-content ">
          <div className="company-name archivo-black-regular">DoctBot</div>
        </div>
      </div>

      <div className="chat-interface">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender} ${message.sender === 'user' ? 'user-message' : ''}`}
            >
              {message.text}
            </div>
          ))}
          {isLoading && <div className="message bot">Loading...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter Your Symptoms.."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
      <div className="side right">

      </div>
    </div>
  );
}

export default App;
