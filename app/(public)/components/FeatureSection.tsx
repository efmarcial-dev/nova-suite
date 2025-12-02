'use client';
import React, {useEffect, useState, useRef} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlack, faFacebook, faStripe, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faCalendar, faArrowUp, faPlus, faMinus, faCogs, faFileAlt, faPuzzlePiece,
  faChartLine, faUserShield, faUsers
 } from "@fortawesome/free-solid-svg-icons";


export default function FeatureSection() {
    
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

  return (
    <>
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
              className="bg-white border border-[#4E7BFF]/10 hover:border-[#4E7BFF]/30 transition-all rounded-xl p-6 flex flex-col items-start"
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
    </>
  )

}