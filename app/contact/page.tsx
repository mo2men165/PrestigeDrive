'use client';

import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebook } from 'react-icons/fa';

export default function Contact() {
  return (
    <section className="container mx-auto py-12 my-16">
      <div className="bg-gradient-to-br from-[#0E253F] to-[#1B365D] rounded-2xl p-10 text-white mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
          Get in Touch
        </p>
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-white/70 text-lg max-w-xl">
          For all inquiries, feel free to reach out or leave your details and one of our experts will be in touch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">We&apos;re Here to Help</h2>
          <p className="text-gray-500 mb-8">
            Have a question or need assistance? Reach out — our team is ready to assist you.
          </p>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                <FaEnvelope className="text-primary text-sm" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</p>
                <a href="mailto:info@elitedrive4u.co.uk" className="text-gray-900 font-medium text-sm hover:text-primary transition-colors">
                  info@elitedrive4u.co.uk
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                <FaPhoneAlt className="text-primary text-sm" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</p>
                <a href="tel:03333391475" className="text-gray-900 font-medium text-sm hover:text-primary transition-colors">
                  03333391475
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                <FaMapMarkerAlt className="text-primary text-sm" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Address</p>
                <p className="text-gray-900 font-medium text-sm">
                  Citibase Brighton, 95 Ditchling Rd,<br />Brighton and Hove, Brighton BN1 4ST
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <a
              href="https://www.facebook.com/share/18NmfMR7Ku/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all duration-200"
            >
              <FaFacebook size={16} />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Send us a Message</h3>
          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-500 mb-1.5">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-medium text-gray-500 mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                placeholder="How can we help you?"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Map */}
      <div className="mt-16 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.8!2d-0.1378!3d50.8376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48758567e1b1e8e5%3A0x29c26fc467a2e78c!2s95%20Ditchling%20Rd%2C%20Brighton%20and%20Hove%2C%20Brighton%20BN1%204ST!5e0!3m2!1sen!2suk"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </section>
  );
}
