'use client'
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlack, faFacebook, faStripe, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faCalendar, faArrowUp, faPlus, faMinus, faCogs, faFileAlt, faPuzzlePiece,
  faChartLine, faUserShield, faUsers
 } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";
import JoinWaitlistModal from "./components/JoinWaitlistModal";
import NewsLetterModal from "./components/NewsLetterModal";


export default function Home() {

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([])

  const toggle = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index)
  }

  useEffect(() => {
    if(activeIndex !== null && refs.current[activeIndex]){
      refs.current[activeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  },[activeIndex])

  const platforms = [
    {name: 'Slack', type: "Chat", icon: faSlack},
    {name: 'Stripe', type: 'Payment', icon: faStripe},
    {name: 'Facebook', type: 'Social', icon: faFacebook},
    {name: 'Google' , type: 'Content', icon: faGoogle }
  ]

  const actions = [
    {icon: faArrowUp, name: 'Muzamal Hussain', tool: "Framer"},
    {icon: faPlus, name: "Smith White", tool: "Figma"},
    {icon: faMinus, name: "Truth Petit", tool: "YouTube"}
  ]

  const features = [
    {
      icon: faCogs,
      title: "AI Automation",
      description: "Automate repetitive tasks with AI and streamline workflows to free your team for high-value work."
    },
    {
      icon: faChartLine,
      title: "Real-Time Dashboards",
      description: "Make smarter decisions with real-time insights tailored to your team and industry. Track customer activity and conversion data with instant, actionable dashboards. "
    },
    {
      icon: faUserShield,
      title: "Enterprise-Grade Security",
      description: "Manage access control with role-based permissions to protect sensitive CRM data. GDPR, HIPAA, and SOC2-ready"
    },
    {
      icon: faUsers,
      title: "Lead & Client Analysis",
      description: "Track leads, clients, and contacts effortlessly and close more deals with less effort."
    },
    {
      icon: faFileAlt,
      title: "Document Handling",
      description: "Secure, organized document workflows tailored for industries like legal, healthcare, and finance."
    },
    {
      icon: faPuzzlePiece,
      title: "Custom Toolkits by Industry",
      description: "Use vertical SaaS modules built for your specific industry—from consulting to construction—no clutter, just what you need."
    },
  ];

  const faqs = [
    {
      question: "What is NovaSuite?",
      answer:
        "NovaSuite is a modern CRM platform built to empower teams with AI-driven insights, automation, and integrated customer management.",
    },
    {
      question: "How does NovaSuite improve sales?",
      answer:
        "With real-time analytics, automated workflows, and lead scoring, NovaSuite helps boost engagement and improve conversion rates.",
    },
    {
      question: "Can I integrate NovaSuite with payment platforms?",
      answer:
        "Yes! NovaSuite supports integrations with Stripe, PayPal, and other gateways for seamless payment management.",
    },
    {
      question: "Is my customer data secure?",
      answer:
        "Absolutely. NovaSuite uses enterprise-grade encryption, access control, and regular audits to keep your data safe.",
    },
  ];

  return (
    <>
    <NewsLetterModal/>
    <section className="w-full py-16 px-6">
      <div className="container mx-auto flex flex-col lg:flex-row items-center">
        {/* Left Column */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          {/* Header with 'New' pill and 'sales tracking availbale */}
          <div className="flex items-center justify-center lg:justify-start space-x-3 ">
            <span className="px-5 py-3 border border-black rounded-full space-x-3 ">
              <span className="px-4 py-1 bg-black rounded-full text-md text-white">
                New
              </span>
              <span className="text-md text-black">Sales Tracking Available</span>
            </span>
            
          </div>

          {/* H1 Title */}
          <h1 className="text-3xl lg:text-6xl font-regular text-gray-900">
          NovaSuite - AI-Powered, Modular SaaS Software Built for Your Industry
          </h1>

          {/* Body Text */}
          <p className="text-base text-gray-600">
          NovaSuite is a smart SaaS platform with AI features, flexible pricing, and tools tailored for solo entrepreneur and small business.
          </p>
          <p className="text-base text-gray-600">
            Stay organized, boost productivity, and manage tasks effortlessly with a powerful AI tool that works across all your devices. Perfect for individuals and small teams.
          </p>

          {/* Call to action button */}
          <div className="flex space-x-4 justify-center md:justify-start lg:justiy-start">
            <button 
              onClick={() => {
                const el = document.getElementById('get-started');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-2 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-full transition-all duration-300 hover:brightness-110 hover:scale-105">
              Join Earyl Access - Lifetime Deal
            </button>
          </div>

        </div>

      {/* Right Column */}
      <div className="lg:w-1/2 mt-12 lg:mt-0 space-y-6">

        {/* Outer Card with Bllu graient */}
        <div className="p-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg space-y-4">
          {/* Inner Card with total Active User */}
          <div className="bg-white p-7 rounded-lg shadow-xl space-y-12 max-w-md mx-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Total Active Users</h3>
              <div className="flex space-x-2">
                <span className="h-3 w-3 bg-red-500 rounded-full"></span>
                <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                <span className="h-3 w-3 bg-yellow-500 rounded-full"></span>
              </div>
            </div>
            {/* Image */}
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <Image src='/images/graph.svg' alt="NovaSuite dashboard showing modular AI tools for different industries" layout="responsive" width={300} height={300} />
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between ">
              <span className="text-2xl font-semibold text-gray-900">26.032</span>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-500 font-semibold text-white rounded-full text-lg">+3.4%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>

    {/* About Section */}
      <div id="about" className="container mx-auto text-center space-y-6 mt-20 ">
        {/** About Us pill */}
        <div className="inline-block px-4 py-1 border border-black rounded-full text-small text-black">
          About Us
        </div>
        {/* Section Heading */}
        <h2 className="lg:text-6xl md:text-4xl text-3xl font-regular text-gray-900 max-w-3xl mx-auto">
          Empowering startups with smart CRM Solutions 
        </h2>
      </div>

    {/* About */}

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10" >
        {/* Column 1 */}
        <div className="bg-gray-100 p-6 rounded-xl text-center space-y-6">
          <h3 className="text-xl font-semibold">Track Projects</h3>
          <p className="text-gray-600">Monitor the number of active deals and sales pipelines in real-time.</p>

          {/* Mini Features Cards */}
          <div className="space-y-4">
            {[1,2,3].map((_,idx) => (
              <div key={idx} className="flex items-start justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="flex gap-3">
                  <div className="w-1 bg-blue-500 rounded-full"/>
                  <div>
                    <h4 className="font-semibold text-left text-sm">Feature Title</h4>
                    <p className="text-xs text-gray-500 text-left">
                      Short description here
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">&rarr;</span>
              </div>
            ))}
          </div>
        </div>
      
        {/* Column 2 */}
        <div className="bg-gray-100 p-6 rounded-xl text-center space-y-6">
          <h3 className="text-xl font-semibold">
            Advanced analytics
          </h3>
          <p className="text-gray-600">Track customer behavior, sales trends & optimize your conversion rates</p>
          {/* Sales Card */}
          <div className="bg-white p-4 rounded lg space-y-4 text-left">


            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Online Sales</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 text-white text-xs flex items-center justify-center rounded-full">
                    ↑
                  </div>
                <span className="text-sm font-semibold text-blue-600">15.52%</span>
              </div>
            </div>

            <div className="text-2xl font-bold">$53,120</div>
            {/* Placeholder for chart */}
            <div className="w-full h-24">
              <Image alt="crm graph" layout="responsive" src='/images/graph_line.svg' width={400} height={100} />
            </div>


            {/* Month lable */}
            <div className="grid grid-cols-6 text-xs text-gray-500 pt-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => (
                <span key={month} className="text-center">{month}</span>
              ))}
            </div>

          </div>
        </div>

        {/* Column 3 */}
        <div className="bg-gray-100 p-6 rounded-xl text-center space-y-6">
          <h3 className="text-xl font-semibold">Task automation</h3>
          <p className="text-gray-600">Automate follow-ups, reminders, and workflow to reduce manual work</p>


          {/* Contributor list */}
          <div className="bg-white p-4 rounded-lg space-y-4 text-left">
            {[1, 2, 3, 4].map((_, idx) => (
              <div key={idx} className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                <img alt='User' src={`https://randomuser.me/api/portraits/men/${idx + 10}.jpg`} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium">Person {idx + 1}</span>
                </div>
                <span className="text-sm font-semibold">$1,200</span>
              </div>
            ))}
          </div>
              

        </div>


      </div>


      <div id="process" className="container mx-auto flex flex-col lg:flex-row items-center mt-20">
        {/* Left Column */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          {/* Header with 'New' pill and 'sales tracking availbale */}
          <div className="flex items-center justify-center lg:justify-start space-x-3 ">
            <span className="px-4 py-1 border border-black rounded-full space-x-3 ">
              
              <span className="text-md text-black">Integration</span>
            </span>
            
          </div>

          {/* H1 Title */}
          <h2 className="text-3xl lg:text-6xl font-regular text-gray-900">
          Easily integrate with your favorite platform
          </h2>

          {/* Body Text */}
          <p className="text-base text-gray-600">
          Easily connect NovaSuite with a variety of third-party tools and platforms to enhance your website&apos;s functionality. From payment systems to email marketing.
          </p>

          {/* Call to action button */}
          <div className="flex space-x-4 justify-center md:justify-start lg:justiy-start">
            <Link href='#get-started' className="px-6 py-2 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-full transition-all duration-300 hover:brightness-110 hover:scale-105">
              Get Started
            </Link>
          </div>

        </div>

      {/* Right Column */}
      <div className="lg:w-1/2 w-full mt-12 lg:mt-0 space-y-6">

        {/* Outer Card with Bllu graient */}
        <div className="p-12 bg-sky-50 rounded-2xl max-w-4xl mx-auto">
          {/* Inner Card with total Active User */}
          <div className="bg-white rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-semibold text-left">Connect Platform</h3>

          <div className="space-y-4">
            {platforms.map((platform, idx) => (
              <div key={idx} className="flex items-center justify-between mb-5">
                {/* Left side with icon + name */}
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-b from-blue-400 to-blue-600 p-2 rounded-md text-white">
                    <FontAwesomeIcon icon={platform.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {platform.name}
                  </span>
                </div>

                {/* Platform type */}
                <span className="text-sm text-gray-500 font-medium">
                  {platform.type}
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>

      </div>
      </div>


      <div className="container mx-auto flex flex-col lg:flex-row items-center mt-20 gap-8">

        {/* Left Column */}
        <div className="lg:w-1/2 w-full mt-12 lg:mt-0 space-y-6">

          {/* Outer Card with Bllu graient */}
          <div className="p-12 bg-sky-50 rounded-2xl max-w-4xl mx-auto">
            {/* Inner Card with total Active User */}
            <div className="bg-white rounded-xl p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
                <FontAwesomeIcon icon={faCalendar} className="text-black w-5 h-5" />
                <span className="text-md text-black">Management</span>
              </div>

              {/* Rows */}
              <div className="space-y-4">
                {actions.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={action.icon} className="text-blue-600 w-4 h-4" />
                      <span>{action.name}</span>
                    </div>
                    <span className="text-gray-500">{action.tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          {/* Header with 'New' pill and 'sales tracking availbale */}
          <div className="flex items-center justify-center lg:justify-start space-x-3 ">
            <span className="px-4 py-1 border border-black rounded-full space-x-3 ">
              
              <span className="text-xl text-black">Management</span>
            </span>
            
          </div>

          {/* H1 Title */}
          <h2 className="text-3xl lg:text-6xl font-regular text-gray-900">
          AI Task Management
          </h2>

          {/* Body Text */}
          <p className="text-base text-gray-600">
          Organize and manage task through natural language input and smart automation., allowing you to manage leads, track customer interactions, and improve your startup&apos;s growth—all in one place.
          </p>

          {/* Call to action button */}
          <div className="flex space-x-4 justify-center md:justify-start lg:justiy-start">
          <Link href='#get-started' className="px-6 py-2 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-full transition-all duration-300 hover:brightness-110 hover:scale-105">
              Get Started
            </Link>
          </div>

        </div>

      
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto text-center space-y-6 mt-20 ">
        {/** About Us pill */}
        <div className="inline-block px-4 py-1 border border-black rounded-full text-small text-black">
          Features
        </div>
        {/* Section Heading */}
        <h2 className="lg:text-6xl md:text-4xl text-3xl font-regular text-gray-900 max-w-3xl mx-auto">
        Powerful Features for Modern CRM Success
        </h2>
      </div>

      <div className="max-w-7xl mx-auto mt-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white border border-black rounded-xl p-6 flex flex-col items-start"
            >
              <div className="bg-gray-100 p-4 rounded-md mb-4 shadow-md">
                <FontAwesomeIcon icon={feature.icon} className="text-blue-600 w-6 h-6 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>


      {/* FAQs Section */}
      <div className="container mx-auto text-center space-y-6 mt-20 ">
        {/** About Us pill */}
        <div className="inline-block px-4 py-1 border border-black rounded-full text-small text-black">
          FAQs
        </div>
        {/* Section Heading */}
        <h2 className="lg:text-6xl md:text-4xl text-3xl font-regular text-gray-900 max-w-3xl mx-auto">
        Everything you need to know about NovaSuite
        </h2>
      </div>


      <div className="w-full md:w-1/2 mx-auto space-y-4 mt-10">
        {faqs.map((faq, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl transition-all duration-500 overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-5 text-left font-medium text-gray-800 focus:outline-none"
              >
                <span className="text-xl">{faq.question}</span>
                <FontAwesomeIcon
                  icon={faPlus}
                  className={`w-4 h-4 text-lg transform transition-transform duration-300 ${
                    isActive ? 'rotate-45 text-blue-600' : 'rotate-0 text-gray-500'
                  }`}
                />
              </button>

              {isActive && (
                <div className="px-5 pb-5 text-sm text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div id="get-started" className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl shadow-md max-w-5xl w-full text-center px-8 py-12 space-y-6 mx-auto mt-20">
        {/* App Icon Box with Logo */}
        <div className="w-20 h-20 bg-white rounded-2xl shadow flex items-center justify-center mx-auto">
          <img
            src="/images/nova_logo.png"
            alt="Nova CRM Logo"
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* SEO Optimized Heading */}
        <h2 className="text-3xl md:text-6xl font-semibold text-white mt-4 mb-4">
        Early Access Offer
        </h2>
        <p className="max-w-2xl mx-auto mt-4 text-white text-md md:text-lg lg:text-xl">
        Join NovaSuite early and receive <strong>lifetime access</strong> at a discounted rate. Limited spots available.
        </p>

        {/* CTA Button */}
        <JoinWaitlistModal/>
      </div>
      

    </section>
    </>
  );
}
