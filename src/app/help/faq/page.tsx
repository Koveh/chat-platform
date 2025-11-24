import React from "react";
import Link from "next/link";
import { ChevronLeft, HelpCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Frequently Asked Questions | UNIQA",
  description: "Find answers to common questions about UNIQA insurance services",
};

export default function FAQPage() {
  const faqCategories = [
    {
      id: "general",
      title: "General Questions",
      icon: "💼",
      questions: [
        {
          question: "What is UNIQA and what services do you provide?",
          answer: "UNIQA is a leading insurance company in Austria and Central and Eastern Europe. We provide a wide range of insurance services, including life, health, property, and auto insurance, as well as pension insurance and investment products. Our goal is to provide comprehensive protection and financial security for our clients."
        },
        {
          question: "How can I contact UNIQA support?",
          answer: "You can contact our support service in several ways: by phone at +43 50677 670 for customers in Austria, at the international number +43 50677 999, by email at info@uniqa.at, through online chat on our website, or by visiting one of our offices in person. Our telephone support service is available 24/7 for emergencies."
        },
        {
          question: "Where are UNIQA offices located?",
          answer: "Our headquarters is located at Untere Donaustraße 21, 1020 Wien, Austria. We also have many regional offices throughout Austria and in other countries where we operate. You can find a complete list of offices and their contact information on the 'Our Offices' page on our website."
        }
      ]
    },
    {
      id: "policies",
      title: "Insurance Policies",
      icon: "📋",
      questions: [
        {
          question: "How do I get a new insurance policy?",
          answer: "You can get a new insurance policy in several ways: online through our website, by phone by contacting our consultants, or in person by visiting one of our offices. To set up a policy, you will need: identification documents, information about the subject of insurance, and bank details for paying insurance premiums."
        },
        {
          question: "What documents are needed to get insurance?",
          answer: "To get insurance, you typically need: identification (passport or ID card), information about the subject of insurance (e.g., car data, property address, medical data for health insurance), and bank details for paying insurance premiums. Depending on the type of insurance, additional documents may be required."
        },
        {
          question: "How is the cost of an insurance policy calculated?",
          answer: "The cost of an insurance policy depends on many factors, including the type of insurance, the insured object, the selected coverage, the insurance amount, the history of insurance claims, and statistical risk data. For an accurate calculation, you can use the calculator on our website or contact our consultants."
        },
        {
          question: "Can I change the terms of an existing policy?",
          answer: "Yes, you can change the terms of an existing policy. To do this, contact our support service or your personal manager. Please note that some changes may lead to a recalculation of the policy cost. Changes take effect after signing the corresponding supplementary agreement."
        }
      ]
    },
    {
      id: "claims",
      title: "Insurance Claims",
      icon: "🛡️",
      questions: [
        {
          question: "How do I file an insurance claim?",
          answer: "You can file an insurance claim through our online form on the website, by calling the hotline, or at the nearest office. To speed up the process, prepare your policy number and all necessary documentation for the insurance claim. It's important to report the insurance claim as soon as possible after it occurs."
        },
        {
          question: "What documents are needed to file an insurance claim?",
          answer: "To file an insurance claim, you typically need: your insurance policy number, identification documents, a description of the insurance event, documents confirming the occurrence of the insurance event (e.g., a police report for a car accident, medical documents for illness), and documents confirming the amount of damage. The specific list of documents depends on the type of insurance."
        },
        {
          question: "How long does it take to process an insurance claim?",
          answer: "The time to process an insurance claim depends on its complexity and the type of insurance. Simple cases can be reviewed within a few days, more complex ones can take up to several weeks. Under Austrian law, an insurance company is obligated to make a decision on an insurance claim within 30 days of receiving all necessary documents."
        },
        {
          question: "What should I do if my insurance claim is rejected?",
          answer: "If your insurance claim is rejected, you have the right to request a written explanation of the reasons for the refusal. If you disagree with the decision, you can file an appeal with our customer service or contact an independent insurance ombudsman. If necessary, you can also go to court."
        }
      ]
    },
    {
      id: "online",
      title: "Online Services",
      icon: "💻",
      questions: [
        {
          question: "How do I register for the UNIQA personal account?",
          answer: "To register for the UNIQA personal account, go to our website uniqa.at and click the 'Register' button in the upper right corner. Fill out the registration form, providing your email, insurance policy number, and personal data. After verifying the data, you will receive a confirmation email at the specified email address. Follow the link in the email to activate your account."
        },
        {
          question: "How do I access my personal account?",
          answer: "You can access your personal account by visiting uniqa.at and clicking the 'Login' button in the upper right corner. Enter your email and password specified during registration. If you forgot your password, use the password recovery function on the login page."
        },
        {
          question: "What operations can I perform in my personal account?",
          answer: "In your personal account, you can: view information about your policies, track the status of insurance payments, pay insurance premiums, download insurance documents, file insurance claims, update personal data, contact support, and receive personalized offers and notifications."
        },
        {
          question: "How do I pay an insurance premium online?",
          answer: "You can pay an insurance premium online through your personal account on the uniqa.at website. Log in to your account, go to the 'My Policies' section, select the desired policy, and click the 'Pay' button. We accept payment by Visa, Mastercard bank cards, as well as by bank transfer or electronic payment systems."
        },
        {
          question: "How do I update my contact information?",
          answer: "You can update your contact information in your personal account on the uniqa.at website. Log in to your account, go to the 'Profile' or 'Account Settings' section, where you can edit your contact information. After making changes, don't forget to click the 'Save' button. You can also update your data by contacting our support service."
        }
      ]
    },
    {
      id: "travel",
      title: "Travel and Insurance Abroad",
      icon: "✈️",
      questions: [
        {
          question: "How do I get travel insurance?",
          answer: "You can get travel insurance online on our website, by phone, or at one of our offices. To purchase online, select the 'Travel Insurance' section, specify the dates and countries of your trip, the number of travelers and their age, choose a suitable insurance package, and pay for the policy. After payment, the insurance policy will be sent to your email."
        },
        {
          question: "What does travel insurance cover?",
          answer: "Standard UNIQA travel insurance covers: medical expenses (including hospitalization and emergency surgery), medical evacuation and repatriation, search and rescue expenses, civil liability, baggage loss, flight delay or cancellation. Additionally, you can purchase coverage for extreme sports, accident insurance, and other options."
        },
        {
          question: "What should I do in case of an emergency abroad?",
          answer: "In case of an emergency abroad, call our 24-hour assistance line at +43 50677 999. Our specialists will help organize necessary medical assistance, evacuation, or other assistance. Keep all documents related to your case (medical reports, bills, receipts), as they will be required for insurance reimbursement."
        },
        {
          question: "Does my UNIQA health insurance work abroad?",
          answer: "Standard UNIQA health insurance usually has limited coverage outside your country of residence. For full coverage of medical expenses while traveling, it is recommended to purchase separate travel insurance. Clients with premium health insurance policies may have extended international coverage; check the details of your policy in your personal account or by contacting our support service."
        }
      ]
    },
    {
      id: "auto",
      title: "Auto Insurance",
      icon: "🚗",
      questions: [
        {
          question: "What types of auto insurance does UNIQA offer?",
          answer: "UNIQA offers three main types of auto insurance: mandatory third-party liability insurance (MTPL), which is required by law; partial comprehensive coverage, which covers certain risks such as theft, fire, natural disasters; and full comprehensive coverage, which provides the most complete protection, including damage resulting from an accident that was your fault. Additional options are also available, such as accident insurance for the driver and passengers, legal protection, and roadside assistance."
        },
        {
          question: "How is the cost of auto insurance calculated?",
          answer: "The cost of auto insurance depends on many factors, including: the make, model, and year of the car, its value and engine power, the age and driving experience of the policyholder, the history of insurance claims (bonus-malus), the region of car use, the selected insurance coverage, and the deductible amount. For an accurate calculation, use the calculator on our website or contact our consultants."
        },
        {
          question: "What should I do in case of a car accident?",
          answer: "In case of a car accident, you need to: ensure safety (turn on hazard lights, set up an emergency stop sign), call the police if there are injuries or significant damage, exchange contacts and insurance policy data with other participants in the accident, collect contacts of witnesses, take photos of the scene and damage, fill out a European accident report if possible. Then report the accident to UNIQA as soon as possible by calling the hotline or through your personal account."
        },
        {
          question: "What does full comprehensive coverage include?",
          answer: "Full comprehensive coverage from UNIQA includes: damage to your car as a result of an accident (regardless of who is at fault), theft or theft of the car or its parts, vandalism, fire, explosion, natural disasters (floods, hail, storms, etc.), damage from animals, broken glass and headlights. Depending on the selected package, additional services may be included, such as towing, providing a replacement car, or compensation for the loss of value of a new car."
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
          Find answers to the most common questions about UNIQA insurance services
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