import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, FileText } from "lucide-react";

const Footer: React.FC = () => {
  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Our Services", path: "/services" },
    { name: "All Trainings", path: "/trainings" },
    { name: "Contact Us", path: "/contact" },
  ];

  const legalLinks = [
    { name: "Government Contracting", path: "/capabilities-statement" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-extrabold text-white"
            >
              {/* <Briefcase size={28} /> */}
              <img src="/mtmkay_logo.png" width="68" height="68" />
              <span>MTMKay</span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-sm">
              Empowering the next generation of IT professionals through
              world-class training and consultancy.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://web.facebook.com/61582751706418/" target="_blank" className="text-gray-400 hover:text-white">
                <Facebook />
              </a>
              {/* <a href="#" className="text-gray-400 hover:text-white">
                <Twitter />
              </a> */}
              <a href="https://www.linkedin.com/company/mtmkay/" target="_blank" className="text-gray-400 hover:text-white">
                <Linkedin />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-base text-gray-400 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-base text-gray-400 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-base text-gray-400">
              <li>
                <a
                  href="mailto:support@mtmkay.com"
                  className="hover:text-white"
                >
                  support@mtmkay.com
                </a>
              </li>
              <li>
                <a href="tel:+237671128616" className="hover:text-white">
                  (+237) 671 128 616
                </a>
              </li>
              <li>Kumba, Southwest Region, Cameroon</li>
              <li>Lido Street, First story building by the right</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} MTMKay Technology, Consulting & Real Estate.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
