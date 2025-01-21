'use client'; // Mark this component as a Client Component

import { navLinks } from '@/constants';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const Navbar = () => {
  const pathname = usePathname(); // Get the current path
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter(); // Initialize the router

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const homeNavigate = () => {
    router.push('/'); 
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800/90 backdrop-blur-sm shadow-lg text-white">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold font-serif cursor-pointer"  onClick={homeNavigate} >PrestigeDrive</h1>

        {/* Desktop Navbar */}
        <ul className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:text-gray-400 ${isActive(link.href) ? 'text-white underline' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden transition-[0.5s] focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Navbar */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <ul className="flex flex-col space-y-4 py-4 px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block hover:text-gray-400 ${isActive(link.href) ? 'text-white underline' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;