import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      {/* Navigation Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>Concrete Army</h1>
          </div>
          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <button 
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h2>Professional Concrete Services</h2>
          <p>Building Strong Foundations for Your Projects</p>
          <a href="#contact" className="cta-button">Get a Free Quote</a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Concrete Driveways</h3>
              <p>Durable and attractive concrete driveways built to last. Professional installation and finishing.</p>
            </div>
            <div className="service-card">
              <h3>Patios & Walkways</h3>
              <p>Custom designed outdoor spaces perfect for entertaining or relaxing with family and friends.</p>
            </div>
            <div className="service-card">
              <h3>Foundation Work</h3>
              <p>Strong, reliable concrete foundations for residential and commercial construction projects.</p>
            </div>
            <div className="service-card">
              <h3>Concrete Repair</h3>
              <p>Expert repair services for damaged concrete surfaces. Restore and maintain your property.</p>
            </div>
            <div className="service-card">
              <h3>Decorative Concrete</h3>
              <p>Stamped, stained, and polished concrete for a beautiful, unique look to any space.</p>
            </div>
            <div className="service-card">
              <h3>Commercial Projects</h3>
              <p>Large-scale concrete solutions for commercial properties and industrial applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2>About Concrete Army</h2>
          <div className="about-content">
            <p>
              With over 15 years of experience in the concrete industry, Concrete Army is your trusted partner 
              for all concrete needs. We pride ourselves on delivering high-quality workmanship, attention to detail, 
              and exceptional customer service.
            </p>
            <p>
              Our team of skilled professionals uses the latest techniques and materials to ensure every project 
              is completed on time and within budget. We serve residential and commercial clients throughout the region.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Get in Touch</h3>
              <p>
                <strong>Phone:</strong>{' '}
                <a href="tel:352-672-4847" className="phone-link">
                  352-672-4847
                </a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:info@concretearmy.com">
                  info@concretearmy.com
                </a>
              </p>
              <p>
                <strong>Hours:</strong><br />
                Monday - Friday: 7:00 AM - 5:00 PM<br />
                Saturday: 8:00 AM - 2:00 PM<br />
                Sunday: Closed
              </p>
            </div>
            <form className="contact-form">
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  required 
                />
              </div>
              <div className="form-group">
                <textarea 
                  placeholder="Your Message" 
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-button">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Concrete Army. All rights reserved.</p>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
