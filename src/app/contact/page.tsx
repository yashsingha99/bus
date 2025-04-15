"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ChevronDown,
  Bus,
  Info,
  HelpCircle,
  Send,
  ArrowRight,
//   Menu,
//   X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const [expanded, setExpanded] = useState<number>(-1);
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [windowWidth, setWindowWidth] = useState(
//     typeof window !== "undefined" ? window.innerWidth : 0
//   );

  // Handle window resize
  // useEffect(() => {
  //   const handleResize = () => {
  //   //   setWindowWidth(window.innerWidth);
  //     if (window.innerWidth >= 768) {
  //       // setMobileMenuOpen(false);
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const toggleFaq = (index: number) => {
    setExpanded(expanded === index ? -1 : index);
  };

//   const selectTab = (tab: string) => {
//     setActiveTab(tab);
//     setMobileMenuOpen(false);
//   };

  const faqData = [
    {
      question: "How do I book a bus ticket?",
      answer:
        "You can book a bus ticket by visiting our website, entering your journey details, selecting your preferred bus and seats, and completing the payment process. You can also book tickets through our mobile app for a more convenient experience.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards, net banking, UPI, and popular digital wallets. All payments are processed through secure payment gateways.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking through our website or app. Cancellation charges may apply depending on how close to the departure time you cancel. Please refer to our cancellation policy for more details.",
    },
    {
      question: "How can I track my bus?",
      answer:
        "You can track your bus in real-time through our app or website. Simply enter your booking details or PNR number to get the current location of your bus.",
    },
  ];

  const helpResources = [
    {
      title: "User Guides",
      description:
        "Step-by-step guides to help you navigate our platform and services.",
      link: "/guides",
      icon: <Info className="h-10 w-10 text-primary" />,
    },
    {
      title: "Support Tickets",
      description:
        "Create a support ticket for specific issues that need our attention.",
      link: "/support",
      icon: <HelpCircle className="h-10 w-10 text-primary" />,
    },
    {
      title: "Video Tutorials",
      description:
        "Watch our video tutorials to learn how to use our services effectively.",
      link: "/tutorials",
      icon: <Bus className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <main className="flex-1 bg-gradient-to-b from-background to-muted min-h-screen">
      {/* Interactive Bus Hero Section */}
      <section className="relative w-full py-12 flex flex-col items-center md:py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-white z-0"></div>

        {/* Animated dots pattern background */}
        {/* <div className="absolute inset-0 z-0 opacity-20">
          {Array(12)
            .fill()
            .map((_, i: number) => (
              <div
                key={i}
                className="absolute rounded-full bg-primary/60 w-2 h-2"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `pulse ${2 + Math.random() * 3}s infinite`,
                }}
              ></div>
            ))}
        </div> */}

        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center">
            {/* <Bus className="h-12 w-12 md:h-16 md:w-16 text-primary animate-bounce" /> */}
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Let&apos;s Connect&apos;
              </h1>
              <p className="max-w-[700px] text-muted-foreground text-sm md:text-lg lg:text-xl">
                Your journey with us does not end after your bus ride.
              </p>
            </div>

            {/* Mobile Navigation */}
            {/* <div className="md:hidden z-50 w-full relative">
              <div className="flex justify-between items-center bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center gap-2 px-4 py-1 text-sm"
                >
                  {activeTab === "contact"
                    ? "Reach Out"
                    : activeTab === "faq"
                      ? "FAQs"
                      : "Help Center"}
                  {mobileMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                <Button
                  size="sm"
                  className="text-xs py-1 px-3 h-8"
                  onClick={() => selectTab("contact")}
                >
                  Contact Now
                </Button>
              </div>

              {mobileMenuOpen && (
                <div className=" bg-background/95 backdrop-blur-md rounded-xl mt-2 p-2 shadow-lg z-50 w-[calc(100%-2rem)] left-4 border border-primary/10 animate-in fade-in-10 zoom-in-95">
                  <button
                    onClick={() => selectTab("contact")}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Reach Out
                  </button>
                  <button
                    onClick={() => selectTab("faq")}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    FAQs
                  </button>
                  <button
                    onClick={() => selectTab("help")}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Help Center
                  </button>
                </div>
              )}
            </div> */}

            {/* Desktop Tab Navigation */}
            <div className=" md:flex bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-lg">
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-4 py-2 rounded-full transition-all ${activeTab === "contact" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                Reach Out
              </button>
              <button
                onClick={() => setActiveTab("faq")}
                className={`px-4 py-2 rounded-full transition-all ${activeTab === "faq" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                FAQs
              </button>
              <button
                onClick={() => setActiveTab("help")}
                className={`px-4 py-2 rounded-full transition-all ${activeTab === "help" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                Help Center
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      {activeTab === "contact" && (
        <section className=" w-full py-8 md:py-16 lg:py-24 flex flex-col items-center rounded-2xl">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-start">
              {/* Contact Information */}
              <div className="relative order-2 lg:order-1">
                <div className="lg:sticky lg:top-20 space-y-6 md:space-y-8 p-4 md:p-6 bg-background/40 backdrop-blur-md rounded-xl md:rounded-3xl shadow-lg border border-primary/10">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 inline-flex items-center">
                      <span className="bg-primary/10 text-primary p-1 md:p-2 rounded-full mr-2 md:mr-3">
                        <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                      </span>
                      How to Reach Us
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                      We are just a message away. Choose your preferred way to
                      connect.
                    </p>
                  </div>

                  <div className="grid gap-4 md:gap-6">
                    <div className="group p-3 md:p-4 rounded-lg md:rounded-xl transition-all hover:bg-primary/5 border border-transparent hover:border-primary/20">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="rounded-full bg-primary/10 p-2 md:p-3 group-hover:bg-primary/20 transition-colors">
                          <Mail className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-base md:text-lg">
                            Drop us an Email
                          </h3>
                          <Link
                            href="mailto:contact@bustify.in"
                            className="text-sm md:text-base text-muted-foreground hover:text-primary inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                          >
                            contact@bustify.in
                            <ArrowRight className="h-3 w-3 md:h-4 md:w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="group p-3 md:p-4 rounded-lg md:rounded-xl transition-all hover:bg-primary/5 border border-transparent hover:border-primary/20">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="rounded-full bg-primary/10 p-2 md:p-3 group-hover:bg-primary/20 transition-colors">
                          <Phone className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-base md:text-lg">
                            Give us a Call
                          </h3>
                          <Link
                            href="tel:+919389240600"
                            className="text-sm md:text-base text-muted-foreground hover:text-primary inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                          >
                            +91 9389240600
                            <ArrowRight className="h-3 w-3 md:h-4 md:w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="group p-3 md:p-4 rounded-lg md:rounded-xl transition-all hover:bg-primary/5 border border-transparent hover:border-primary/20">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="rounded-full bg-primary/10 p-2 md:p-3 group-hover:bg-primary/20 transition-colors">
                          <MapPin className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-base md:text-lg">
                            Place
                          </h3>
                          <address className="text-sm md:text-base text-muted-foreground not-italic group-hover:translate-x-1 transition-transform">
                            Mathura
                            <br />
                            Uttar Pradesh
                          </address>
                        </div>
                      </div>
                    </div>

                    <div className="group p-3 md:p-4 rounded-lg md:rounded-xl transition-all hover:bg-primary/5 border border-transparent hover:border-primary/20">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="rounded-full bg-primary/10 p-2 md:p-3 group-hover:bg-green-100 transition-colors">
                          <MessageSquare className="h-4 w-4 md:h-6 md:w-6 text-primary group-hover:text-green-600 transition-colors" />
                        </div>
                        <div>
                          <h3 className="font-medium text-base md:text-lg">
                            Join WhatsApp Community
                          </h3>
                          <Link
                            href="https://chat.whatsapp.com/HMwj6abLzr2KZoywNmDFzW"
                            className="text-sm md:text-base text-muted-foreground hover:text-green-600 inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                          >
                            Connect with fellow travelers
                            <ArrowRight className="h-3 w-3 md:h-4 md:w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="relative order-1 lg:order-2">
                <div className="p-4 md:p-6 lg:p-8 rounded-xl md:rounded-3xl bg-background/40 backdrop-blur-md shadow-lg border border-primary/10 relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>

                  <form className="space-y-4 md:space-y-6 relative z-10">
                    <div className="space-y-1 md:space-y-2">
                      <h2 className="text-2xl md:text-3xl font-bold">
                        Let&apos;s Talk&apos;
                      </h2>
                      <p className="text-sm md:text-base text-muted-foreground">
                        We would love to hear from you
                      </p>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <div className="relative">
                        <label
                          className="absolute -top-2.5 left-3 md:left-4 px-1 md:px-2 bg-background text-xs md:text-sm font-medium text-muted-foreground"
                          htmlFor="name"
                        >
                          Your Name
                        </label>
                        <input
                          id="name"
                          placeholder="John Doe"
                          className="w-full rounded-lg md:rounded-xl border border-input bg-background/60 px-3 md:px-4 py-2 md:py-3 text-sm ring-offset-background focus:border-primary focus:outline-none transition-all"
                          type="text"
                          required
                        />
                      </div>

                      <div className="relative">
                        <label
                          className="absolute -top-2.5 left-3 md:left-4 px-1 md:px-2 bg-background text-xs md:text-sm font-medium text-muted-foreground"
                          htmlFor="email"
                        >
                          Email Address
                        </label>
                        <input
                          id="email"
                          placeholder="john@example.com"
                          className="w-full rounded-lg md:rounded-xl border border-input bg-background/60 px-3 md:px-4 py-2 md:py-3 text-sm ring-offset-background focus:border-primary focus:outline-none transition-all"
                          type="email"
                          required
                        />
                      </div>

                      <div className="relative">
                        <label
                          className="absolute -top-2.5 left-3 md:left-4 px-1 md:px-2 bg-background text-xs md:text-sm font-medium text-muted-foreground"
                          htmlFor="message"
                        >
                          Your Message
                        </label>
                        <textarea
                          id="message"
                          placeholder="How can we help you today?"
                          className="w-full min-h-[120px] md:min-h-[180px] rounded-lg md:rounded-xl border border-input bg-background/60 px-3 md:px-4 py-2 md:py-3 text-sm ring-offset-background focus:border-primary focus:outline-none transition-all resize-none"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full rounded-lg md:rounded-xl group relative overflow-hidden h-10 md:h-12"
                    >
                      <span className="absolute inset-0 w-0 bg-primary-foreground/10 transition-all duration-300 group-hover:w-full"></span>
                      <span className="relative flex items-center justify-center gap-2">
                        Send Message
                        <Send className="h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* FAQ Section */}
      {activeTab === "faq" && (
        <section className="w-full py-8 flex flex-col items-center md:py-16 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4 text-center mb-8 md:mb-12">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[700px] text-sm md:text-base text-muted-foreground">
                  Find answers to common questions about our services
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl space-y-3 md:space-y-4">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg md:rounded-xl border border-primary/10 bg-background/40 backdrop-blur-md overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex items-center justify-between w-full p-4 md:p-6 text-left"
                  >
                    <h3 className="text-base md:text-lg font-semibold">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`h-4 w-4 md:h-5 md:w-5 text-primary transition-transform duration-300 ${expanded === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`px-4 md:px-6 overflow-hidden transition-all duration-300 ${
                      expanded === index ? "max-h-96 pb-4 md:pb-6" : "max-h-0"
                    }`}
                  >
                    <p className="text-sm md:text-base text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Help Center */}
      {activeTab === "help" && (
        <section className="w-full py-8 flex flex-col items-center md:py-16 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4 text-center mb-8 md:mb-12">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Help Center
                </h2>
                <p className="max-w-[700px] text-sm md:text-base text-muted-foreground">
                  Need more assistance? We have got you covered
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {helpResources.map((resource, index) => (
                <div
                  key={index}
                  className="group rounded-lg md:rounded-xl border border-primary/10 bg-background/40 backdrop-blur-md p-4 md:p-6 hover:shadow-lg transition-all hover:border-primary/30 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="bg-primary/10 p-3 md:p-4 rounded-full w-fit mb-3 md:mb-4 group-hover:bg-primary/20 transition-colors">
                      {resource.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">
                      {resource.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                      {resource.description}
                    </p>
                    {/* <Link href={resource.link}> */}
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          Explore
                          <ArrowRight className="h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    {/* </Link> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Add custom CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.4;
          }
        }

        @keyframes fade-in-10 {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes zoom-in-95 {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-in {
          animation-duration: 300ms;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: both;
        }

        .fade-in-10 {
          animation-name: fade-in-10;
        }

        .zoom-in-95 {
          animation-name: zoom-in-95;
        }
      `}</style>
      <Footer />
    </main>
  );
}
