import React, { useState } from 'react';
import './App.css';
import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init('pk_xxxxxxxxxxxxxx');

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await emailjs.send(
        'service_pf1j7sk',
        'contact_form',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          reply_to: formData.email
        }
      );
      
      setSuccess('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('EmailJS error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Concrete Army</h1>
      </header>
      
      <main className="App-main">
        <section className="contact-section">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </section>
      </main>
    </div>
  );
}

export default App;