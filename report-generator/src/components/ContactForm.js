import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./../styles/ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(""); // Status for feedback message

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Replace with your EmailJS credentials
    const serviceID = "service_t1sky0m" ; // Your EmailJS Service ID
    const templateID = "template_b6bimqi"; // Your EmailJS Template ID
    const publicKey = "MaDoveEfkMKDqgGi1"; // Replace with your actual Public Key

    // Parameters to send to EmailJS
    const params = {
      from_name: formData.name,
      email_id: formData.email,
      message: formData.message,
    };

    // Send email using EmailJS
    emailjs
      .send(serviceID, templateID, params, publicKey)
      .then(() => {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Reset form
      })
      .catch(() => {
        setStatus("Failed to send the message. Please try again later.");
      });
  };

  return (
    <section className="contact-form-container">
      {/* Background Image with Text Overlay */}
      <div className="hero-section">
        <div className="overlay-text">
          <h1>RadiX: Contact Us</h1>
          <p>
            Looking for a faster, more accurate way to diagnose chest X-rays? Look no further than
            RadiX - the radiologist-approved framework that uses cutting-edge Deep Learning
            techniques to analyze and generate detailed reports. With RadiX, you can streamline
            your radiology workflow and get the results you need in seconds.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="form-header">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Reach out with your feedback or questions.</p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            placeholder="Type your message here"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </section>
  );
};

export default ContactForm;
