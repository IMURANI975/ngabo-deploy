// App.jsx - Main Component
import React, { useState, useEffect } from 'react';

import {
  Scissors,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Menu,
  X,
  ChevronRight,
  Star,
  CheckCircle,
  Calendar,
  User,
  Mail,
  Award,
  Heart
} from 'lucide-react';


function Nav() {
     const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Team', href: '#team' },
    { name: 'Book Now', href: '#booking' },
    { name: 'About us', href: '/about' },
  ];
    
  return (
    <div> <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-rose-600 rounded-full flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ngabo Saloon</h1>
                    <p className="text-sm text-amber-600">Premium Grooming</p>
                  </div>
                </div>
    
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-amber-600 font-medium transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                  <button className="px-6 py-2 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                    Book Now
                  </button>
                </div>
    
                {/* Mobile Menu Button */}
                <button
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
    
              {/* Mobile Menu */}
              {isMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
                  <div className="flex flex-col space-y-4 pt-4">
                    {navItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-gray-700 hover:text-amber-600 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav></div>
  )
}

export default Nav