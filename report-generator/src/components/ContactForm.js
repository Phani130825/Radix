import React from "react";
import "./../styles/ContactForm.css";

const ContactForm = () => {
  return (
    <section className="contact-form">
      <h2>Contact Us</h2>
      <form>
        <label>Name</label>
        <input type="text" placeholder="Your name" />
        <label>Email</label>
        <input type="email" placeholder="Your email" />
        <label>Message</label>
        <textarea placeholder="Your message"></textarea>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};

export default ContactForm;
