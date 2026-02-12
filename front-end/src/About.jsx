// AboutUsPage.jsx - Complete About Us Page
import React from 'react';
import {
  Scissors,
  Sparkles,
  Award,
  Users,
  Heart,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  ChevronRight,
  Target,
  Gem,
  Shield,
  Calendar,
  Trophy,
  Smile,
  CheckCircle,
  Quote
} from 'lucide-react';

const AboutUsPage = () => {
  const milestones = [
    { year: '2010', title: 'Humble Beginnings', description: 'Started as a small barbershop in Kigali' },
    { year: '2013', title: 'First Expansion', description: 'Moved to larger premises, added spa services' },
    { year: '2015', title: 'Award Winning', description: 'Recognized as Best Salon in Rwanda' },
    { year: '2018', title: 'Team Growth', description: 'Expanded to 15 professional stylists' },
    { year: '2020', title: 'Digital Transformation', description: 'Launched online booking system' },
    { year: '2023', title: 'Premium Relaunch', description: 'Rebranded as Ngabo Premium Saloon' },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Passion for Beauty',
      description: 'We pour our heart into every service, ensuring each client feels special.',
      color: 'from-rose-500 to-pink-500'
    },
    {
      icon: <Gem className="w-8 h-8" />,
      title: 'Excellence',
      description: 'Only the highest standards in service, products, and customer care.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community',
      description: 'Building relationships that go beyond just haircuts and styling.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trust',
      description: 'Creating a safe, welcoming space where everyone feels comfortable.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Constantly learning and adapting to bring you the latest trends.',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Transformation',
      description: 'Helping clients discover and enhance their unique beauty.',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const teamStats = [
    { icon: <Users />, value: '15+', label: 'Expert Stylists' },
    { icon: <Calendar />, value: '13+', label: 'Years Experience' },
    { icon: <Smile />, value: '5000+', label: 'Happy Clients' },
    { icon: <Trophy />, value: '12', label: 'Industry Awards' },
  ];

  const certifications = [
    'Certified Master Colorist',
    'International Styling Diploma',
    'Professional Barber License',
    'Spa & Wellness Certification',
    'Advanced Hair Extension Specialist',
    'Bridal Styling Expert'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 md:px-8 bg-gradient-to-br from-amber-50 to-rose-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm mb-6">
                <Sparkles className="w-4 h-4 text-amber-600 mr-2" />
                <span className="text-amber-700 font-medium">Our Story</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Crafting Beauty, <span className="gradient-text">Building Confidence</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                For over a decade, Ngabo Saloon has been more than just a salon. We are a sanctuary where beauty meets artistry, where every client leaves not just looking better, but feeling empowered.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center">
                  Book Appointment <ChevronRight className="ml-2 w-5 h-5" />
                </button>
                <button className="px-8 py-3 border-2 border-amber-600 text-amber-600 rounded-full font-semibold hover:bg-amber-50 transition-all">
                  Meet Our Team
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1562788869-4ed32648eb72?auto=format&fit=crop&w=600&q=80"
                      alt="Master Stylist"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80"
                      alt="Salon Interior"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80"
                      alt="Hair Coloring"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80"
                      alt="Team Training"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl max-w-xs">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-rose-600 rounded-full flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Award Winning</h3>
                    <p className="text-sm text-gray-600">Since 2015</p>
                  </div>
                </div>
                <p className="text-gray-600">Recognized for excellence in customer service and styling innovation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                From Humble <span className="text-amber-600">Beginnings</span> to Excellence
              </h2>
              
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Founded in 2010 by James Ngabo, what started as a single-chair barbershop has grown into Kigali's premier salon destination. Our journey has been driven by a simple belief: everyone deserves to feel confident and beautiful.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Over the years, we've evolved from a traditional barbershop into a comprehensive beauty destination, expanding our services while maintaining the personal touch that made us popular.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Today, Ngabo Saloon stands as a testament to passion, dedication, and an unwavering commitment to excellence in the beauty industry.
                </p>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-rose-50 rounded-2xl">
                <div className="flex items-start">
                  <Quote className="w-8 h-8 text-amber-600 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      "Beauty is not just about looking good; it's about feeling empowered. That's the philosophy we live by at Ngabo Saloon."
                    </p>
                    <p className="text-amber-600 font-semibold">— James Ngabo, Founder</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1562788869-4ed32648eb72?auto=format&fit=crop&w=800&q=80"
                  alt="Founder James Ngabo"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs">
                <h3 className="font-bold text-gray-900 mb-2">James Ngabo</h3>
                <p className="text-amber-600 font-medium mb-3">Founder & Master Stylist</p>
                <div className="flex items-center text-gray-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <span className="ml-2">5.0 Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones Timeline */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Our <span className="text-amber-600">Journey</span> Through Years
            </h2>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-400 to-rose-400 hidden lg:block" />
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Content */}
                    <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="text-3xl font-bold text-amber-600 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Year Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-rose-600 rounded-full border-4 border-white" />
                    </div>
                    
                    {/* Spacer for mobile */}
                    <div className="lg:hidden w-full h-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-6 md:px-8 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Core <span className="text-amber-600">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Ngabo Saloon
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {value.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Certifications */}
      <section className="py-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Stats */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                By The <span className="text-amber-600">Numbers</span>
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                {teamStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-lg text-center group hover:shadow-xl transition-shadow"
                  >
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Certifications */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Our <span className="text-amber-600">Expertise</span>
              </h2>
              
              <div className="bg-gradient-to-br from-white to-rose-50 rounded-2xl p-8 shadow-lg">
                <p className="text-gray-600 mb-6">
                  Our team holds certifications from the world's leading beauty institutions, ensuring you receive top-tier service.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-gray-600">
                    All our stylists undergo continuous training to stay updated with the latest trends and techniques.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="py-20 px-6 md:px-8 bg-gradient-to-br from-amber-600 to-rose-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Visit Our Salon</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Experience the Ngabo difference at our beautiful Kigali location
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <MapPin className="w-8 h-8 mr-4" />
                <div>
                  <h3 className="text-xl font-bold">Location</h3>
                  <p className="opacity-90">123 Beauty Street, Kigali</p>
                </div>
              </div>
              <p className="opacity-90">Located in the heart of the city with ample parking and easy access.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 mr-4" />
                <div>
                  <h3 className="text-xl font-bold">Hours</h3>
                  <p className="opacity-90">Mon-Sat: 9AM-8PM, Sun: 10AM-6PM</p>
                </div>
              </div>
              <p className="opacity-90">We recommend booking appointments in advance to secure your preferred time.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Phone className="w-8 h-8 mr-4" />
                <div>
                  <h3 className="text-xl font-bold">Contact</h3>
                  <p className="opacity-90">+250 788 123 456</p>
                </div>
              </div>
              <p className="opacity-90">Call, WhatsApp, or book online through our website.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white text-amber-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg">
              Get Directions
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-3xl p-12 shadow-xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Experience <span className="text-amber-600">Ngabo Saloon</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of satisfied clients who trust us with their beauty needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-full font-semibold hover:shadow-xl transition-all">
                Book Your First Visit
              </button>
              <button className="px-8 py-4 border-2 border-amber-600 text-amber-600 rounded-full font-semibold hover:bg-amber-50 transition-all">
                Contact Us
              </button>
            </div>
          </div>
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
              <p className="text-gray-400 mb-6">
                Crafting beauty and building confidence since 2010.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <div className="space-y-3">
                {['Home', 'Services', 'Gallery', 'Team', 'Book Now'].map((item) => (
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
              <h3 className="text-xl font-bold mb-6">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe for styling tips and exclusive offers
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 bg-gray-800 rounded-l-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button className="px-6 bg-gradient-to-r from-amber-600 to-rose-600 rounded-r-full font-semibold hover:opacity-90 transition-opacity">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 Ngabo Saloon. All rights reserved.</p>
            <p className="mt-2 text-sm">Proudly serving Kigali since 2010</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;