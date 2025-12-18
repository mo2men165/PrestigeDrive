import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { contactInfo, quickLinks, services, socialMedia } from '@/constants';
import { logo } from '@/public/assets';

const Footer = () => {
  return (
    <footer className="bg-white text-primary py-12">
      <div className="container mx-auto px-4 ">
        <div className="mb-8 flex flex-col justify-center items-center">
            <Image src={logo} alt="MyEasyDrive" width={200} height={100} />

          <p className="mt-4 text-primary">
            Your trusted partner for luxury car rentals.
          </p>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-primary hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    href={`/services`}
                    className="text-primary hover:text-secondary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-primary">
              {contactInfo.map((info, index) => (
                <li key={index}>
                  <strong>{info.label}:</strong> {info.value}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialMedia.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    className="text-primary hover:text-secondary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={24} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="text-center border-t border-gray-800 pt-6">
          <p className="text-primary">
            &copy; {new Date().getFullYear()} MyEasyDrive. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;