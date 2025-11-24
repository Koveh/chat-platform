"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FAQPage() {
  const faqCategories = [
    {
      id: "ai-chat",
      title: "AI Chat",
      icon: "🤖",
      questions: [
        {
          question: "How do I use the AI chat feature?",
          answer: "To use the AI chat, simply navigate to the main chat page and start typing your questions. The AI assistant can help you with various topics including document analysis, general questions, and more. You can also upload PDF files and ask questions about their content. The AI will use the document as context for answering your questions."
        },
        {
          question: "Can I upload documents for the AI to analyze?",
          answer: "Yes! You can upload PDF documents through the file uploader. Once uploaded, you can ask questions about the document content. The AI will use the document as context when answering your questions. Supported formats include PDF files from the ML course materials, slides, exercises, solutions, and exam prep materials."
        },
        {
          question: "What types of questions can I ask the AI?",
          answer: "You can ask the AI various types of questions including: explanations of concepts from uploaded documents, help with understanding complex topics, general knowledge questions, and analysis of document content. The AI is particularly helpful for learning and understanding course materials."
        },
        {
          question: "How does the AI remember our conversation?",
          answer: "The AI maintains conversation history within each chat session. Your messages are saved in the database and persist across sessions. You can view your chat history in the sidebar, and each chat is stored separately. To start a fresh conversation, you can create a new chat or clear the current one."
        },
        {
          question: "Can I have multiple conversations with different topics?",
          answer: "Yes! Each document or topic can have its own chat. When you select a different file or start a new conversation, it creates a separate chat thread. You can switch between different chats using the chat history in the sidebar. Each chat maintains its own context and conversation history."
        },
        {
          question: "Is my chat data private and secure?",
          answer: "Yes, your chat data is stored securely in the database and is only accessible to you. Each user's chat history is private and cannot be accessed by other users. We use secure authentication and database encryption to protect your data."
        },
        {
          question: "How does document ingestion work?",
          answer: "When you select a document, the system automatically extracts text from the PDF and stores it in chunks. This allows the AI to search for relevant content based on your questions. The ingestion happens automatically when you ask questions about a document, so you don't need to manually process files."
        },
        {
          question: "What file formats are supported?",
          answer: "Currently, we support PDF files. The system can extract text from text-based PDFs. If a PDF contains only images, it may not be processed correctly. We're working on adding OCR support for image-based PDFs in the future."
        }
      ]
    },
    {
      id: "document-search",
      title: "Document Search",
      icon: "🔍",
      questions: [
        {
          question: "How do I search for documents?",
          answer: "Use the Document Search page to find documents by name or category. You can filter results and preview PDFs directly in the browser. The search looks through available ML course materials including slides, exercises, solutions, and exam prep materials."
        },
        {
          question: "Can I preview documents before selecting them?",
          answer: "Yes! Click the preview icon next to any document in the search results to view it in a popup window. This allows you to quickly check if a document is relevant before asking questions about it."
        },
        {
          question: "What is Document Deep Dive?",
          answer: "Document Deep Dive is a feature that allows you to ask detailed questions about a specific document. Select a document, then ask questions using prepared templates or your own custom questions. The AI will analyze the document content and provide detailed answers."
        }
      ]
    },
    {
      id: "account",
      title: "Account & Settings",
      icon: "👤",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click on 'Sign up' or 'Register' on the login page. You'll need to provide your name, email address, and create a password (minimum 8 characters). After registration, you can immediately start using the platform."
        },
        {
          question: "How do I log in?",
          answer: "Use the 'Sign In' button and enter your email and password. You can choose to 'Remember me for 1 year' to stay logged in. If you forget your password, use the password recovery option."
        },
        {
          question: "How do I update my profile information?",
          answer: "Go to your profile page from the sidebar menu. You can update your name and other account information there. Changes are saved automatically."
        },
        {
          question: "How do I log out?",
          answer: "Click on your profile in the sidebar, then select 'Log out' from the dropdown menu. This will end your session and redirect you to the login page."
        }
      ]
    },
    {
      id: "features",
      title: "Platform Features",
      icon: "⚙️",
      questions: [
        {
          question: "What is the Statistics page?",
          answer: "The Statistics page shows an overview of your platform usage including total chats, messages, users, and recent activity. You can access it from the sidebar user menu."
        },
        {
          question: "How do I view my chat history?",
          answer: "Your chat history is displayed in the sidebar. Each chat is organized by document or topic. Click on any chat in the history to resume that conversation."
        },
        {
          question: "Can I delete my chat history?",
          answer: "Yes, you can clear individual chats using the clear button in the chat interface. This will remove all messages from that specific chat while keeping other chats intact."
        },
        {
          question: "How do I share documents with others?",
          answer: "Currently, documents are private to your account. We're working on sharing features that will allow you to share documents and chat conversations with other users."
        }
      ]
    }
  ];

  return (
    <div className="container max-w-screen-xl mx-auto py-12 px-4 h-screen overflow-y-auto">
      <div className="mb-8">
        <Link href="/help" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ChevronLeft size={18} className="mr-1" />
          Back to Help Page
        </Link>
        <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mb-8">
          Find answers to the most common questions about using the AI chat platform
        </p>

        {/* Search */}
        <div className="max-w-2xl mb-12 relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Search questions..." 
            className="pl-10 pr-4 py-6 text-lg w-full"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {faqCategories.map((category) => (
          <a 
            key={category.id} 
            href={`#${category.id}`} 
            className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
          >
            <div className="text-3xl mb-2">{category.icon}</div>
            <h3 className="font-medium">{category.title}</h3>
            <span className="text-sm text-gray-500">{category.questions.length} questions</span>
          </a>
        ))}
      </div>

      {/* Question sections */}
      <div className="space-y-16">
        {faqCategories.map((category) => (
          <section key={category.id} id={category.id}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">{category.icon}</span>
              {category.title}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold mb-3 flex items-start">
                    <HelpCircle size={20} className="mr-2 text-blue-600 flex-shrink-0 mt-1" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 ml-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Contact us */}
      <div className="mt-20 bg-blue-50 p-8 rounded-xl">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Couldn't Find Your Answer?</h2>
          <p className="text-gray-600 mb-6">
            If you couldn't find an answer to your question, please contact our customer
            support. We're always here to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/help">
                Contact Information
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/contact">
                Send a Message
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 