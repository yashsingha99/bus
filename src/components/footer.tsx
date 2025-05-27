"use client"

import React from 'react'
import Link from "next/link";
import { TermsDialog } from "@/components/ui/terms-dialog";
import { PrivacyDialog } from "@/components/ui/private-dialog";
import { MessageSquare } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full py-12 rounded-ss-2xl rounded-se-2xl  bg-black text-white relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="absolute inset-0">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-8 right-0 w-72 h-72 bg-purple-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                Bustify.in
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Making bus travel easier and more convenient for everyone.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://chat.whatsapp.com/HMwj6abLzr2KZoywNmDFzW"
                target="_blank"
                className="text-green-500 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Join our WhatsApp Group</span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/services"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Services
                  </Link>
                </li> */}
                {/* <li>
                  <Link
                    href="/routes"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Routes
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://forms.gle/xpgNcUQzBca2oJ4M8"
                    className="text-yellow-400 hover:text-primary transition-colors"
                  >
                    Apply For Coordinater
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Support</h3>
              <ul className="space-y-2">
                <li>
                  <TermsDialog />
                </li>
                <li>
                  <PrivacyDialog />
                </li>
                <li>
                  <Link
                    href="/contact#faq"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-gray-400">
              Subscribe to our newsletter for updates and offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button
                type="submit"
                className="w-full px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-0 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Bustify. All rights reserved.
            </p>
            {/* <div className="flex space-x-6">
                <TermsDialog />
                <PrivacyDialog />
                <Button
                  variant="link"
                  className="text-gray-400 hover:text-primary p-0 h-auto font-normal"
                >
                  Cookies
                </Button>
              </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer