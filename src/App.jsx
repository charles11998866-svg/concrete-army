import { useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

function App() {
  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('pk_xxxxxxxxxxxxx');
  }, []);

  const handleContactFormSubmit = (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);
    const templateParams = {
      to_email: formData.get('email'),
      from_name: formData.get('name'),
      message: formData.get('message'),
    };

    // Send email using EmailJS
    emailjs
      .send(
        'service_xxxxxxxxxxxxx',
        'contact_form',
        templateParams
      )
      .then((response) => {
        console.log('Email sent successfully:', response);
        alert('Your message has been sent successfully!');
        e.target.reset();
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        alert('Failed to send your message. Please try again.');
      });
  };

  return (
    <div className="App">
      {/* Your existing App content */}
      
      {/* Contact Form */}
      <form onSubmit={handleContactFormSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
        ></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default App;
