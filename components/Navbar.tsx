'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { navLinks } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { logo } from '@/public/assets';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path: string) => pathname === path;

  const homeNavigate = () => {
    router.push('/');
  };

  // Handle scroll behavior
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsNavbarVisible(false); // Hide navbar on scroll down
      } else {
        setIsNavbarVisible(true); // Show navbar on scroll up
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-transform duration-300 ${
          isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Hamburger Menu Button */}
          <button
            className="p-2 rounded-full hover:bg-primary text-primary hover:text-white transition-colors focus:outline-none"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6 "
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

          {/* Brand Name */}
          <Image
          src={logo}
          alt='MyEasyDrive'
          width={200}
          height={200}
          onClick={homeNavigate}
          className='cursor-pointer'
          />

        </div>
      </nav>

      {/* Sidebar with Framer Motion */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            ></motion.div>

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary text-primary hover:text-white transition-colors focus:outline-none"
                  onClick={toggleSidebar}
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
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>

                {/* Sidebar Links */}
                <ul className="mt-8 space-y-4">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`block hover:text-primary transition-colors duration-200 ${
                          isActive(link.href) ? 'text-primary underline' : 'text-gray-700'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;