import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Scale, Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation('navigation');

  const navItems = [
    { path: '/', label: t('home') },
    { path: '/chat', label: t('chat') },
    { path: '/constitution', label: t('constitution') },
    { path: '/bill-of-rights', label: t('billOfRights') },
    { path: '/legal-aid', label: t('legalAid') },
    { path: '/find-lawyer', label: t('findLawyer') },
    { path: '/about', label: t('about') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-transparent shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-800" />
              <span className="text-xl font-bold text-gray-900">SheriaBot</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <LanguageSwitcher />
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-800 text-white'
                    : 'text-gray-700 hover:text-blue-800 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <div className="px-3 py-2">
                <LanguageSwitcher />
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-800 text-white'
                      : 'text-gray-700 hover:text-blue-800 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;