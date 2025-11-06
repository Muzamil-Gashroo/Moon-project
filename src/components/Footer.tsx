/**
 * Footer component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = React.memo(() => {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">Monnn</h3>
            <p className="text-sm opacity-90">
              Premium Himalayan Shilajit, Kashmiri Saffron, and finest dry fruits.
              Bringing nature's treasures to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="opacity-90 hover:opacity-100 transition-smooth">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="opacity-90 hover:opacity-100 transition-smooth">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 transition-smooth">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 transition-smooth">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="opacity-90">dummy@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="opacity-90">+91 00000 0000 </span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="opacity-90">Kashmir, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Monnn. All rights reserved.</p>
          <a href='https://www.linkedin.com/in/muzamil-bashir-gashroo-8268b4228/'> Developed By Musaib Gashroo</a>
          
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
