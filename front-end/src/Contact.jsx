// ContactUsPage.jsx - Complete Contact Page
import React, { useState } from 'react';
import { createContact } from './api/contacts';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Send,
  CheckCircle,
  X,
  User,
  Calendar,
  Scissors,
  Sparkles,
  ChevronRight,
  Heart
} from 'lucide-react';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Our Salon',
      details: ['123 Beauty Street', 'Kigali, Rwanda'],
      description: 'Located in the heart of Kigali with ample parking space',
      color: 'from-blue-500 to-cyan-500',
      link: 'https://maps.google.com',
      linkText: 'Get Directions →'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      details: ['+250 788 123 456', '+250 789 987 654'],
      description: 'Available Mon-Sat: 9AM-8PM, Sun: 10AM-6PM',
      color: 'from-green-500 to-emerald-500',
      link: 'tel:+250788123456',
      linkText: 'Call Now →'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      details: ['hello@ngabosaloon.com', 'bookings@ngabosaloon.com'],
      description: 'We respond within 24 hours',
      color: 'from-rose-500 to-pink-500',
      link: 'mailto:hello@ngabosaloon.com',
      linkText: 'Send Email →'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'WhatsApp',
      details: ['+250 788 123 456'],
      description: 'Quick replies during business hours',
      color: 'from-green-600 to-teal-500',
      link: 'https://wa.me/250788123456',
      linkText: 'Message Us →'
    }
  ];

  const faqs = [
    {
      question: 'What are your operating hours?',
      answer: 'We are open Monday through Saturday from 9:00 AM to 8:00 PM, and Sundays from 10:00 AM to 6:00 PM.'
    },
    {
      question: 'Do I need an appointment?',
      answer: 'While walk-ins are welcome, we highly recommend booking an appointment to ensure availability with your preferred stylist.'
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'We require 24 hours notice for cancellations. Late cancellations may incur a 50% service fee.'
    },
    {
      question: 'Do you accept credit cards?',
      answer: 'Yes, we accept all major credit cards, mobile payments (Mobile Money), and cash.'
    },
    {
      question: 'Is there parking available?',
      answer: 'Yes, we have dedicated parking for our clients behind the salon building.'
    },
    {
      question: 'Do you offer gift cards?',
      answer: 'Yes! Gift cards are available in any amount and can be purchased in-salon or online.'
    }
  ];

  const teamContacts = [
    {
      name: 'James Ngabo',
      role: 'Owner & Master Stylist',
      phone: '+250 788 111 222',
      email: 'james@ngabosaloon.com',
      image: 'https://images.unsplash.com/photo-1562788869-4ed32648eb72?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Sarah Mutesi',
      role: 'Salon Manager',
      phone: '+250 788 333 444',
      email: 'sarah@ngabosaloon.com',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Grace Uwase',
      role: 'Customer Service',
      phone: '+250 788 555 666',
      email: 'grace@ngabosaloon.com',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    createContact(formData)
      .then(() => {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          preferredContact: 'email'
        });
      })
      .catch((err) => {
        setSubmitError(
          err?.response?.data?.error ||
            err?.response?.data?.errors?.[0]?.msg ||
            'Failed to send message. Please try again.'
        );
      })
      .finally(() => setSubmitting(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 mb-6">
              <Sparkles className="w-4 h-4 text-amber-600 mr-2" />
              <span className="text-amber-700 font-medium">Get In Touch</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Let's <span className="gradient-text">Connect</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help you look and feel your best. Reach out to us through any channel that works for you.
            </p>
          </div>

          {/* Contact Methods Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-full bg-white shadow-lg p-2">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  activeTab === 'contact'
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white'
                    : 'text-gray-600 hover:text-amber-600'
                }`}
              >
                Contact Form
              </button>
              <button
                onClick={() => setActiveTab('book')}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  activeTab === 'book'
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white'
                    : 'text-gray-600 hover:text-amber-600'
                }`}
              >
                Quick Booking
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  activeTab === 'faq'
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white'
                    : 'text-gray-600 hover:text-amber-600'
                }`}
              >
                FAQ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Contact Cards */}
            <div className="lg:col-span-1 space-y-8">
              {/* Contact Information Cards */}
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow group"
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="text-white">
                      {info.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{info.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700">{detail}</p>
                    ))}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{info.description}</p>
                  
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700 transition-colors"
                  >
                    {info.linkText}
                  </a>
                </div>
              ))}

              {/* Social Media */}
              <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <p className="text-gray-300 mb-6">Stay updated with our latest styles and offers</p>
                
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <Clock className="w-6 h-6 text-amber-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Operating Hours</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM' },
                    { day: 'Saturday', hours: '9:00 AM - 8:00 PM' },
                    { day: 'Sunday', hours: '10:00 AM - 6:00 PM' },
                  ].map((schedule, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">{schedule.day}</span>
                      <span className="font-semibold text-gray-900">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                  <p className="text-amber-800 text-sm">
                    <span className="font-semibold">Note:</span> Last appointments are taken 30 minutes before closing.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Forms/Content */}
            <div className="lg:col-span-2">
              {/* Success Message */}
              {isSubmitted && (
                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 animate-fade-in">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mr-4" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Message Sent Successfully!</h3>
                      <p className="text-gray-600">We'll get back to you within 24 hours. Thank you for reaching out!</p>
                    </div>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="mb-8 p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200">
                  <p className="text-rose-700">{submitError}</p>
                </div>
              )}

              {/* Contact Form */}
              {activeTab === 'contact' && (
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                  <p className="text-gray-600 mb-8">Fill out the form below and we'll respond as soon as possible</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 mb-2">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="+250 788 123 456"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Subject *</label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="">Select a subject</option>
                          <option value="booking">Booking Inquiry</option>
                          <option value="service">Service Question</option>
                          <option value="pricing">Pricing Inquiry</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Your Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-4">Preferred Contact Method</label>
                      <div className="flex flex-wrap gap-4">
                        {['email', 'phone', 'whatsapp'].map((method) => (
                          <label key={method} className="flex items-center">
                            <input
                              type="radio"
                              name="preferredContact"
                              value={method}
                              checked={formData.preferredContact === method}
                              onChange={handleChange}
                              className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="ml-2 text-gray-700 capitalize">{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-4 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-full font-semibold hover:shadow-xl transition-all flex items-center group disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Sending...' : 'Send Message'}
                        <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                      <p className="ml-6 text-gray-500 text-sm">
                        By submitting, you agree to our Privacy Policy
                      </p>
                    </div>
                  </form>
                </div>
              )}

              {/* Quick Booking Form */}
              {activeTab === 'book' && (
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Quick Appointment Booking</h2>
                  <p className="text-gray-600 mb-8">Book your next appointment in just a few clicks</p>
                  
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 mb-2">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Phone Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="+250 788 123 456"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Preferred Date *</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="date"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Preferred Time *</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                          <option value="">Select time</option>
                          {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'].map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2">Select Service *</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                          <option value="">Choose a service</option>
                          <option value="haircut">Haircut & Styling - $35</option>
                          <option value="coloring">Hair Coloring - $60+</option>
                          <option value="beard">Beard Grooming - $25</option>
                          <option value="spa">Spa Treatment - $60</option>
                          <option value="nails">Manicure/Pedicure - $30</option>
                          <option value="bridal">Bridal Package - $150+</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2">Preferred Stylist (Optional)</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                          <option value="">Any available stylist</option>
                          <option value="james">James Ngabo (Master Stylist)</option>
                          <option value="sarah">Sarah Mutesi (Beard Specialist)</option>
                          <option value="grace">Grace Uwase (Spa Therapist)</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2">Special Requests</label>
                        <textarea
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Any specific requirements or notes..."
                        />
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service:</span>
                          <span className="font-semibold">Haircut & Styling</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-semibold">45 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated Price:</span>
                          <span className="font-semibold">$35.00</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all"
                    >
                      Confirm Booking Request
                    </button>
                    
                    <p className="text-center text-gray-500 text-sm">
                      We'll confirm your appointment within 2 hours via your preferred contact method.
                    </p>
                  </form>
                </div>
              )}

              {/* FAQ Section */}
              {activeTab === 'faq' && (
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
                  <p className="text-gray-600 mb-8">Find answers to common questions about our salon</p>
                  
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:border-amber-300 transition-colors"
                      >
                        <details className="group">
                          <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                            <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                          </summary>
                          <div className="px-6 pb-6 pt-2">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                    <p className="text-gray-600 mb-4">
                      Don't hesitate to reach out to us directly. We're here to help!
                    </p>
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700"
                    >
                      Contact Us Now <ChevronRight className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Interactive Map */}
              <div className="mt-8 bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Find Us</h3>
                  <p className="text-gray-600">Visit our salon at the location below</p>
                </div>
                
                {/* Map Container */}
                <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* This would be a real map integration (Google Maps, Mapbox, etc.) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-amber-600 to-rose-600 rounded-full flex items-center justify-center mb-4">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Ngabo Saloon</h4>
                      <p className="text-gray-600">123 Beauty Street, Kigali</p>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-6 py-2 bg-white border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  </div>
                  
                  {/* Map Marker */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="animate-ping absolute inset-0 bg-amber-400 rounded-full opacity-20"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-amber-600 to-rose-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <Scissors className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Contacts */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Our Team Directly</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {teamContacts.map((member, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-amber-100">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-gray-900">{member.name}</h4>
                          <p className="text-amber-600 text-sm">{member.role}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center text-gray-600 hover:text-amber-600 transition-colors"
                        >
                          <Phone className="w-4 h-4 mr-3" />
                          {member.phone}
                        </a>
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center text-gray-600 hover:text-amber-600 transition-colors"
                        >
                          <Mail className="w-4 h-4 mr-3" />
                          {member.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 px-6 md:px-8 bg-gradient-to-r from-amber-600 to-rose-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for styling tips, special offers, and salon updates
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-amber-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          <p className="mt-4 text-white/70 text-sm">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-rose-600 rounded-full flex items-center justify-center">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Ngabo Saloon</h2>
                  <p className="text-amber-400">Premium Grooming</p>
                </div>
              </div>
              <p className="text-gray-400">
                Your trusted partner in beauty and grooming since 2010.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <div className="space-y-3">
                {['Home', 'Services', 'Gallery', 'Team', 'About Us'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-amber-400 mr-3" />
                  <span className="text-gray-400">123 Beauty Street, Kigali</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-amber-400 mr-3" />
                  <span className="text-gray-400">+250 788 123 456</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-amber-400 mr-3" />
                  <span className="text-gray-400">hello@ngabosaloon.com</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Mon - Fri</span>
                  <span className="text-white">9AM - 8PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Saturday</span>
                  <span className="text-white">9AM - 8PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sunday</span>
                  <span className="text-white">10AM - 6PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 Ngabo Saloon. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUsPage;