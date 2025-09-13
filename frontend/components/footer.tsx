"use client";
import Link from "next/link";
import { Logo } from "@/components/logo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="animate-in slide-in-from-bottom-4 duration-700">
            <Logo size="md" className="mb-4 text-white" />
            <p className="text-gray-400 leading-relaxed">
              The most trusted platform connecting students for flexible
              short-term housing solutions.
            </p>
          </div>
          <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="#safety"
                  className="hover:text-white transition-colors"
                >
                  Safety & Trust
                </Link>
              </li>
              <li>
                <Link
                  href="/post-property"
                  className="hover:text-white transition-colors"
                >
                  List Property
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-in slide-in-from-bottom-4 duration-700 delay-200">
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#support"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#guidelines"
                  className="hover:text-white transition-colors"
                >
                  Guidelines
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#cookies"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 animate-in slide-in-from-bottom-4 duration-700 delay-400">
          <p>&copy; 2024 SubLease Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
