import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'


const Footer = () => {
  return (
    <div>
        {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                YogaMaster
                <img src="/yoga.png" alt="YogaMaster" className="w-8 h-8" />
              </h3>
              <p className="text-gray-400 text-sm">
                Transform your body and mind with our comprehensive yoga classes and expert instructors.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="text-gray-400 hover:text-primary transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/classes" className="text-gray-400 hover:text-primary transition-colors">
                    Classes
                  </a>
                </li>
                <li>
                  <a href="/instructors" className="text-gray-400 hover:text-primary transition-colors">
                    Instructors
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-gray-400 hover:text-primary transition-colors">
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>

            {/* Classes */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Classes</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Hatha Yoga
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Vinyasa Flow
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Ashtanga Yoga
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Yin Yoga
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Contact Us</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-400">
                    123 Yoga Street<br />
                    New York, NY 10001
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-primary flex-shrink-0" />
                  <a href="tel:+1234567890" className="text-gray-400 hover:text-primary transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-primary flex-shrink-0" />
                  <a href="mailto:info@yogamaster.com" className="text-gray-400 hover:text-primary transition-colors">
                    info@yogamaster.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>&copy; 2024 YogaMaster. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
