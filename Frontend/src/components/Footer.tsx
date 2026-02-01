import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon, MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
const socialLinks = [{
  icon: FacebookIcon,
  href: 'https://facebook.com',
  label: 'Facebook'
}, {
  icon: InstagramIcon,
  href: 'https://instagram.com',
  label: 'Instagram'
}, {
  icon: TwitterIcon,
  href: 'https://twitter.com',
  label: 'Twitter'
}, {
  icon: LinkedinIcon,
  href: 'https://linkedin.com',
  label: 'LinkedIn'
}];
const quickLinks = [{
  label: 'Home',
  href: '/'
}, {
  label: 'Properties',
  href: '/properties'
}, {
  label: 'Favorites',
  href: '/favorites'
}, {
  label: 'Messages',
  href: '/messages'
}];
export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  return <footer className="bg-gradient-to-br from-primary to-primary-light text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-primary font-bold text-lg">FM</span>
              </div>
              <span className="text-white font-bold text-xl">Flat-Mate</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Nepal's most trusted platform for finding rooms, flats, and
              apartments. Connecting property owners with verified tenants
              across major cities.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return <motion.a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" whileHover={{
                scale: 1.1,
                y: -2
              }} whileTap={{
                scale: 0.95
              }} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors" aria-label={social.label}>
                    <Icon className="w-5 h-5" />
                  </motion.a>;
            })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.1
        }}>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => <li key={link.label}>
                  <Link to={link.href} className="text-white/80 hover:text-white transition-colors text-sm inline-block hover:translate-x-1 transform duration-200">
                    {link.label}
                  </Link>
                </li>)}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors text-sm inline-block hover:translate-x-1 transform duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors text-sm inline-block hover:translate-x-1 transform duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/80 hover:text-white transition-colors text-sm inline-block hover:translate-x-1 transform duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/80 hover:text-white transition-colors text-sm inline-block hover:translate-x-1 transform duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }}>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/80">
                <MapPinIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/80">
                <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+9779841234567" className="hover:text-white transition-colors">
                  +977 984-1234567
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/80">
                <MailIcon className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:info@flatmate.com.np" className="hover:text-white transition-colors">
                  info@flatmate.com.np
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Flat-Mate Nepal. All rights
              reserved.
            </p>
            <div className="flex gap-6 text-sm text-white/60">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}