import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'concrete-repair',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeNav, setActiveNav] = useState('home');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    try {
      // Using API proxy integration - the proxy will handle CORS and forward to actual email service
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'concrete-army-website'
        })
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. We will contact you soon.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'concrete-repair',
          message: ''
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or call us directly.'
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveNav(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      {/* Navigation Header */}
      <header className="header">
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">
              <h1>🏗️ CONCRETE ARMY</h1>
              <p className="tagline">Professional Concrete Solutions</p>
            </div>
            <ul className="nav-menu">
              <li><button className={activeNav === 'home' ? 'active' : ''} onClick={() => scrollToSection('home')}>Home</button></li>
              <li><button className={activeNav === 'services' ? 'active' : ''} onClick={() => scrollToSection('services')}>Services</button></li>
              <li><button className={activeNav === 'about' ? 'active' : ''} onClick={() => scrollToSection('about')}>About</button></li>
              <li><button className={activeNav === 'contact' ? 'active' : ''} onClick={() => scrollToSection('contact')}>Contact</button></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h2>Expert Concrete Solutions for Every Project</h2>
          <p>From repairs to new installations, Concrete Army delivers quality workmanship and reliability</p>
          <button className="cta-button" onClick={() => scrollToSection('contact')}>Get Your Free Quote</button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🔧</div>
              <h3>Concrete Repair</h3>
              <p>Professional repair services for cracks, spalls, and damage. We restore your concrete to like-new condition.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🏠</div>
              <h3>Driveway Installation</h3>
              <p>Custom driveway installations with expert finishing. Durable, attractive, and built to last.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🪨</div>
              <h3>Patio & Deck</h3>
              <p>Beautiful outdoor concrete patios and decorative stamped concrete for your home.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🏢</div>
              <h3>Commercial Work</h3>
              <p>Large-scale commercial concrete projects with professional project management and scheduling.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔨</div>
              <h3>Foundation Work</h3>
              <p>Expert foundation repair and installation services meeting all building codes and standards.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">✨</div>
              <h3>Decorative Concrete</h3>
              <p>Polished, stained, and stamped concrete for stunning visual results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2>About Concrete Army</h2>
          <div className="about-content">
            <div className="about-text">
              <h3>Trusted by Hundreds of Customers</h3>
              <p>With over 15 years of experience in the concrete industry, Concrete Army has built a reputation for excellence, reliability, and customer satisfaction.</p>
              <ul className="about-list">
                <li>✓ Licensed and Insured</li>
                <li>✓ Free Estimates</li>
                <li>✓ Warranty on All Work</li>
                <li>✓ Professional Team</li>
                <li>✓ Timely Project Completion</li>
                <li>✓ Competitive Pricing</li>
              </ul>
            </div>
            <div className="about-stats">
              <div className="stat">
                <h4>500+</h4>
                <p>Projects Completed</p>
              </div>
              <div className="stat">
                <h4>15+</h4>
                <p>Years Experience</p>
              </div>
              <div className="stat">
                <h4>100%</h4>
                <p>Customer Satisfaction</p>
              </div>
              <div className="stat">
                <h4>24/7</h4>
                <p>Emergency Service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with Form */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>Get in Touch</h2>
          <div className="contact-wrapper">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <div className="info-item">
                <strong>📞 Phone:</strong>
                <p>(555) 123-4567</p>
              </div>
              <div className="info-item">
                <strong>📧 Email:</strong>
                <p>info@concretearmy.com</p>
              </div>
              <div className="info-item">
                <strong>📍 Address:</strong>
                <p>123 Construction Way<br />Builder City, ST 12345</p>
              </div>
              <div className="info-item">
                <strong>⏰ Hours:</strong>
                <p>Monday - Friday: 7AM - 6PM<br />Saturday: 8AM - 4PM<br />Sunday: Closed</p>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Send us a Message</h3>
              
              {submitStatus && (
                <div className={`form-message ${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="service">Service Needed *</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                >
                  <option value="concrete-repair">Concrete Repair</option>
                  <option value="driveway-installation">Driveway Installation</option>
                  <option value="patio-deck">Patio & Deck</option>
                  <option value="commercial">Commercial Work</option>
                  <option value="foundation">Foundation Work</option>
                  <option value="decorative">Decorative Concrete</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us about your project..."
                  rows="5"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Concrete Army. All rights reserved. | Proud Builders of Lasting Infrastructure</p>
          <div className="social-links">
            <a href="#" title="Facebook">f</a>
            <a href="#" title="Twitter">𝕏</a>
            <a href="#" title="Instagram">📷</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
