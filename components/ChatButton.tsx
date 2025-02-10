'use client';
import { useState } from "react";
import emailjs from "emailjs-com";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", query: "" });

  const toggleChat = () => setIsOpen(!isOpen);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send data via Email.js (replace with your credentials)
    // try {
    //   await emailjs.send(
    //     "service_lajllhr", // Replace with your Email.js service ID
    //     "template_1fgx54n", // Replace with your template ID
    //     formData,
    //     "your_public_key" // Replace with your Email.js public key
    //   );
    //   alert("Message sent successfully!");
    //   setFormData({ name: "", email: "", query: "" }); // Reset form
    //   setIsOpen(false); // Close chat form
    // } catch (error) {
    //   console.error("Error sending message:", error);
    //   alert("Failed to send message. Please try again.");
    // }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        💬 Chat
      </button>

      {/* Chat Form */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-72 bg-white p-4 shadow-lg rounded-md border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Chat with us</h3>
            <button onClick={toggleChat} className="text-gray-600 hover:text-red-500">✖</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <textarea
              name="query"
              placeholder="Your Message"
              value={formData.query}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatButton;
