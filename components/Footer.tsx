import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { contactInfo, quickLinks, services, socialMedia } from '@/constants';
import { logoSquare } from '@/public/assets';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-600">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <Image src={logoSquare} alt="EliteDrive4U" width={100} height={100} className="mb-4" />
            <p className="text-gray-500 text-sm leading-relaxed">
              Your trusted partner for premium car rentals and professional chauffeur services across the UK &amp; Ireland.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-primary text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-5">Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    href="/services"
                    className="text-gray-500 hover:text-primary text-sm transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-secondary mt-1 shrink-0" />
                <span className="text-gray-500 text-sm">Citibase Brighton, 95 Ditchling Rd, Brighton and Hove, Brighton BN1 4ST</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-secondary shrink-0" />
                <a href="tel:03333391475" className="text-gray-500 hover:text-primary text-sm transition-colors">03333391475</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-secondary shrink-0" />
                <a href="mailto:info@elitedrive4u.co.uk" className="text-gray-500 hover:text-primary text-sm transition-colors">info@elitedrive4u.co.uk</a>
              </li>
            </ul>

            {socialMedia.length > 0 && (
              <div className="flex gap-3 mt-6">
                {socialMedia.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon size={16} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} EliteDrive4U. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
