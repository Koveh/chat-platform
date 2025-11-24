import React from "react";
import Link from "next/link";
import { Phone, Mail, MessageCircle, HelpCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Help & Support | Koveh",
  description: "Get help and support for Koveh services",
};

export default function HelpPage() {
  // Contact information for support services
  const contactMethods = [
    {
      icon: <Phone size={24} />,
      title: "Phone Support",
      description: "24/7 support by phone",
      contacts: [
        { label: "Austria", value: "+43 664 137 78 67", href: "tel:+436641377867" },
      ],
      hours: "24/7",
    },
    {
      icon: <Mail size={24} />,
      title: "Email",
      description: "Send us a message and we'll get back to you within 24 hours",
      contacts: [
        { label: "General inquiries", value: "info@koveh.com", href: "mailto:info@koveh.com" },
        { label: "Technical support", value: "support@koveh.com", href: "mailto:support@koveh.com" },
      ],
      hours: "Response within 24 hours",
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Online Chat",
      description: "Start a chat with our specialists",
      contacts: [
        { label: "Start chat", value: "https://koveh.com", href: "https://koveh.com" },
      ],
      hours: "Mon-Fri: 8:00-18:00",
    },
  ];


  // Frequently asked questions
  const faqs = [
    {
      question: "How do I file an insurance claim?",
      answer: "You can file an insurance claim through our online form, by calling our hotline, or at your nearest office. To speed up the process, please have your policy number and all necessary documentation about the claim ready."
    },
    {
      question: "What documents do I need to get insurance?",
      answer: "To get insurance, you typically need: identification documents, information about the insurance subject (e.g., car details or property address), and banking details for premium payments."
    },
    {
      question: "How do I access my personal account?",
      answer: "You can access your personal account on the koveh.com website. If you haven't registered yet, click on 'Register' and follow the instructions. If you've forgotten your password, use the password recovery function."
    },
    {
      question: "What should I do in case of an emergency abroad?",
      answer: "In case of an emergency abroad, call our 24/7 assistance hotline at +43 50677 999. Our specialists will help arrange necessary medical assistance or support."
    },
  ];

  return (
    <div className="container max-w-screen-xl mx-auto py-12 px-4 h-screen overflow-y-auto bg-gray-100">
      <div className="mb-16">
        <h1 className="text-4xl font-bold mb-6">Help & Support</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Our support team is ready to help you with any questions related to Koveh services.
          Choose your preferred contact method.
        </p>
      </div>

      {/* Contact methods */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold">{method.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-4">{method.description}</p>
              
              <div className="space-y-2 mb-4">
                {method.contacts.map((contact, idx) => (
                  <div key={idx}>
                    <p className="text-sm text-gray-500">{contact.label}</p>
                    <a 
                      href={contact.href}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      {contact.value}
                    </a>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-2" />
                <span>{method.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently asked questions */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <Link href="/help/faq" className="text-blue-600 hover:underline flex items-center">
            View all questions
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-2 flex items-start">
                <HelpCircle size={20} className="mr-2 text-blue-600 flex-shrink-0 mt-1" />
                {faq.question}
              </h3>
              <p className="text-gray-600 ml-7">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild className="px-8">
            <Link href="/help/faq">
              All Frequently Asked Questions
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
} 