'use client';
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, MessageCircle, Users, Headphones } from 'lucide-react';

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill in all required fields!');
      return;
    }
    alert('Message sent successfully! Ham aap se jald contact karenge.');
    setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      subtitle: "Call us anytime",
      info: ["+92 300 1234567", "+92 21 1234567"],
      color: "blue",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Mail,
      title: "Email Support",
      subtitle: "Send us an email",
      info: ["info@ecommerce.com", "support@ecommerce.com"],
      color: "green",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: MapPin,
      title: "Visit Our Store",
      subtitle: "Come meet us",
      info: ["Plot 123, Block A", "Gulshan-e-Iqbal, Karachi"],
      color: "purple",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      subtitle: "Chat with our team",
      info: ["Available 24/7", "Instant responses"],
      color: "orange",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  const supportFeatures = [
    {
      icon: Headphones,
      title: "24/7 Customer Support",
      description: "Ham hamesha aap ki service mein hazir hain"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Experienced professionals ready to help"
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "Average response time: 2 hours"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Contact Us
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Ham aap ki madad k liye hamesha hazir hain. Koi bhi sawal ho to contact kariye!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-8 text-center group">
              <div className={`${method.bgColor} p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <method.icon className={`w-10 h-10 ${method.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{method.title}</h3>
              <p className="text-gray-600 mb-4">{method.subtitle}</p>
              {method.info.map((info, i) => (
                <p key={i} className="text-gray-700 font-medium">{info}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info & Features */}
          <div className="lg:col-span-1 space-y-8">
            {/* Main Contact Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-2xl">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Phone</h4>
                    <p className="text-gray-600">+92 300 1234567</p>
                    <p className="text-gray-600">+92 21 1234567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-2xl">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Email</h4>
                    <p className="text-gray-600">info@ecommerce.com</p>
                    <p className="text-gray-600">support@ecommerce.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-2xl">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Address</h4>
                    <p className="text-gray-600">Plot 123, Block A</p>
                    <p className="text-gray-600">Gulshan-e-Iqbal, Karachi</p>
                    <p className="text-gray-600">Pakistan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Features */}
            <div className="space-y-4">
              {supportFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-3xl text-white">
              <h3 className="text-2xl font-bold mb-4">Need Immediate Help?</h3>
              <p className="text-blue-100 mb-6">
                Ham hamesha aap ki service mein hazir hain. Koi bhi sawal ho to turant call kariye ya message bhejiye.
              </p>
              <div className="flex space-x-4">
                <button className="bg-white bg-opacity-20 px-6 py-3 rounded-xl hover:bg-opacity-30 transition-all duration-300 font-semibold backdrop-blur-sm">
                  Live Chat
                </button>
                <button className="bg-white bg-opacity-20 px-6 py-3 rounded-xl hover:bg-opacity-30 transition-all duration-300 font-semibold backdrop-blur-sm">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-3xl shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Send us a Message</h3>
                <p className="text-gray-600 text-lg">Fill out the form below and we'll get back to you soon</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Full Name *</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder="Aap ka naam"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Email Address *</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder="aapka@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Phone Number</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Subject</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                    >
                      <option value="">Select Subject</option>
                      <option value="order-inquiry">Order Inquiry</option>
                      <option value="product-question">Product Question</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="complaint">Complaint</option>
                      <option value="return-refund">Return & Refund</option>
                      <option value="partnership">Business Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Message *</label>
                  <textarea
                    // rows="6"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none text-lg"
                    placeholder="Aap ka message yahan likhiye... Jo bhi sawal ya problem hai, detail mein batayiye"
                  ></textarea>
                </div>

                <button
                  onClick={handleContactSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center space-x-3"
                >
                  <Send className="w-6 h-6" />
                  <span>Send Message</span>
                </button>

                <p className="text-center text-gray-600 text-sm">
                  * Required fields. Ham aap ko 24 hours ke andar jawab denge.
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-800 mb-2">Order tracking kaise karu?</h4>
                  <p className="text-gray-600">Aap apne order ko track karne ke liye order number use kar sakte hain ya account mein login kar ke dekh sakte hain.</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-800 mb-2">Return policy kya hai?</h4>
                  <p className="text-gray-600">Ham 7 din ka return policy dete hain original packaging ke sath. Product damage nahi hona chahiye.</p>
                </div>
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-bold text-gray-800 mb-2">Payment methods kya available hain?</h4>
                  <p className="text-gray-600">Cash on delivery, bank transfer, JazzCash, Easypaisa aur credit/debit cards accept karte hain.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;