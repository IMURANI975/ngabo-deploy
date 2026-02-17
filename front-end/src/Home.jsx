// Home.jsx - Main Component with Socket.IO Real-Time Gallery Updates
import React, { useState, useEffect, useRef } from 'react';
import { createAppointment } from './api/appointments';
import { fetchAllServices } from './api/services';
import { fetchAllGalleryImages } from './api/gallery';
import { FaWhatsapp } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { io } from 'socket.io-client';

import {
  Scissors,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Menu,
  X,
  ChevronRight,
  Star,
  CheckCircle,
  Calendar,
  User,
  Mail,
  Award,
  Heart,
  Loader,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

// 🔌 SOCKET.IO CONNECTION
const socket = io('http://localhost:5000');

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState('all');
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: '',
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  
  // API Integration States - ORIGINAL LOGIC RESTORED
  const [services, setServices] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [servicesError, setServicesError] = useState('');
  const [galleryError, setGalleryError] = useState('');
  


  const API_BASE_URL = 'http://localhost:5000';


  // Hero Slider States - KEEPING SLIDER FRONTEND
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true);
  const slideIntervalRef = useRef(null);

  // Hero Images for Slider - KEEPING SLIDER IMAGES
  const heroImages = [
    {
      id: 1,
      url: 'https://i.pinimg.com/736x/ab/a4/b0/aba4b0971476934e954519f61c0ceb55.jpg',
      title: 'Hair Coloring Excellence',
      subtitle: 'Transform your look with our expert coloring services'
    },
    {
      id: 2,
      url: 'https://i.pinimg.com/1200x/cd/3d/f0/cd3df0c71bf40d97ac48c6380b59c855.jpg',
      title: 'Professional Hair Styling',
      subtitle: 'Modern cuts and classic styles for every occasion'
    },
    {
      id: 3,
      url: 'https://i.pinimg.com/1200x/dc/b8/b0/dcb8b0e4b5433787f7aacfb2815d0190.jpg',
      title: 'Creative Makeup Artistry',
      subtitle: 'Enhance your natural beauty with our makeup artists'
    },
    {
      id: 4,
      url: 'https://i.pinimg.com/736x/43/a6/99/43a699f4597b0915559d2b548a264213.jpg',
      title: 'Luxury Spa Treatments',
      subtitle: 'Pamper yourself with our premium beauty services'
    }
  ];

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    // { name: 'Team', href: '#team' },
    { name: 'Book Now', href: '#booking' },
    { name: 'About us', href: '/about' },
    { name: 'contact us', href: '/contact' },
  ];

  // Fallback services data (if API fails) - ORIGINAL LOGIC RESTORED
  const fallbackServices = [
    {
      _id: 'hair',
      name: 'Hair Styling',
      description: 'Professional haircuts, coloring, and styling for all hair types',
      price: 35,
      duration: '45-90 mins',
      category: 'hair',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800',
      popular: true
    },
    {
      _id: 'beard',
      name: 'Beard Grooming',
      description: 'Precision beard trimming and grooming services',
      price: 25,
      duration: '30 mins',
      category: 'beard',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800',
      popular: false
    },
    {
      _id: 'spa',
      name: 'Spa Treatments',
      description: 'Relaxing facial treatments and skincare services',
      price: 60,
      duration: '60-120 mins',
      category: 'spa',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800',
      popular: true
    },
    {
      _id: 'nails',
      name: 'Nail Care',
      description: 'Manicure, pedicure, and nail art services',
      price: 30,
      duration: '45-60 mins',
      category: 'nails',
      image: 'https://images.unsplash.com/photo-1607779097040-86b5e5bc77ea?auto=format&fit=crop&w=800',
      popular: false
    },
    {
      _id: 'bridal',
      name: 'Bridal Packages',
      description: 'Complete bridal makeover and wedding preparation',
      price: 150,
      duration: '3-4 hours',
      category: 'bridal',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800',
      popular: true
    },
    {
      _id: 'kids',
      name: "Kids' Cuts",
      description: 'Special haircuts for children in a fun environment',
      price: 20,
      duration: '30 mins',
      category: 'kids',
      image: 'https://images.unsplash.com/photo-1596703923338-48f1c07e4f2e?auto=format&fit=crop&w=800',
      popular: false
    }
  ];

  const teamMembers = [
    {
      name: 'James Ngabo',
      role: 'Master Stylist',
      experience: '12 years',
      specialty: 'Hair Coloring',
      image: 'https://images.unsplash.com/photo-1562788869-4ed32648eb72?auto=format&fit=crop&w=400',
      rating: 4.9
    },
    {
      name: 'Sarah Mutesi',
      role: 'Beard Specialist',
      experience: '8 years',
      specialty: 'Beard Art',
      image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400',
      rating: 4.8
    },
    {
      name: 'Grace Uwase',
      role: 'Spa Therapist',
      experience: '10 years',
      specialty: 'Facial Treatments',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400',
      rating: 4.9
    },
    {
      name: 'David Kalisa',
      role: 'Nail Artist',
      experience: '6 years',
      specialty: 'Nail Art',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400',
      rating: 4.7
    }
  ];

  const testimonials = [
    {
      name: 'Alex Kamali',
      service: 'Haircut & Styling',
      comment: 'Best salon experience ever! James is a true artist.',
      rating: 5,
      date: '2 days ago'
    },
    {
      name: 'Marie Uwera',
      service: 'Bridal Package',
      comment: 'Made my wedding day perfect! The team is amazing.',
      rating: 5,
      date: '1 week ago'
    },
    {
      name: 'Peter Ndayisaba',
      service: 'Beard Grooming',
      comment: 'Professional service with great attention to detail.',
      rating: 4,
      date: '3 days ago'
    }
  ];

  // Auto Slide Effect - KEEPING SLIDER FUNCTIONALITY
  useEffect(() => {
    if (autoSlide) {
      slideIntervalRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [autoSlide, currentSlide]);

  // Pause auto slide on hover
  const pauseAutoSlide = () => {
    setAutoSlide(false);
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
  };

  const resumeAutoSlide = () => {
    setAutoSlide(true);
  };

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentSlide) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  // Fetch Services from API - ORIGINAL LOGIC RESTORED
  useEffect(() => {
    const loadServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError('');
        const data = await fetchAllServices();
        
        if (data && data.length > 0) {
          setServices(data);
        } else {
          // Use fallback if API returns empty
          setServices(fallbackServices);
        }
      } catch (error) {
        console.error('Error loading services:', error);
        setServicesError('Failed to load services. Using default services.');
        // Use fallback services on error
        setServices(fallbackServices);
      } finally {
        setServicesLoading(false);
      }
    };

    loadServices();
  }, []);

  // 🔌 SOCKET.IO: Fetch Gallery Images with Real-Time Updates
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        setGalleryLoading(true);
        setGalleryError('');
        const data = await fetchAllGalleryImages();
        
        if (data && data.length > 0) {
          // Transform API data to match component structure
          const transformedImages = data.map((img, index) => ({
            id: img._id || index,
            category: img.category || 'hair',
            title: img.title || `Gallery Image ${index + 1}`,
            description: img.description || 'Beautiful transformation',
            likes: img.likes || Math.floor(Math.random() * 200) + 50,
            image: img.imageUrl || img.image,
            beforeAfter: img.beforeImage && img.afterImage ? {
              before: img.beforeImage,
              after: img.afterImage
            } : null
          }));
          setGalleryImages(transformedImages);
        } else {
          // Use fallback gallery if API returns empty
          setGalleryImages(getFallbackGalleryImages());
        }
      } catch (error) {
        console.error('Error loading gallery:', error);
        setGalleryError('Failed to load gallery. Using default images.');
        // Use fallback gallery on error
        setGalleryImages(getFallbackGalleryImages());
      } finally {
        setGalleryLoading(false);
      }
    };

    loadGalleryImages();

    // 🔌 SOCKET.IO LISTENERS FOR REAL-TIME GALLERY UPDATES
    socket.on('gallery:new', (newImage) => {
      console.log('New gallery image received:', newImage);
      const transformedImage = {
        id: newImage._id,
        category: newImage.category || 'hair',
        title: newImage.title || 'New Image',
        description: newImage.description || 'Beautiful transformation',
        likes: newImage.likes || Math.floor(Math.random() * 200) + 50,
        image: newImage.imageUrl || newImage.image,
        beforeAfter: newImage.beforeImage && newImage.afterImage ? {
          before: newImage.beforeImage,
          after: newImage.afterImage
        } : null
      };
      setGalleryImages(prev => [transformedImage, ...prev]);
    });

    socket.on('gallery:delete', (id) => {
      console.log('Gallery image deleted:', id);
      setGalleryImages(prev => prev.filter(img => img.id !== id && img._id !== id));
    });

    socket.on('gallery:update', (updatedImage) => {
      console.log('Gallery image updated:', updatedImage);
      const transformedImage = {
        id: updatedImage._id,
        category: updatedImage.category || 'hair',
        title: updatedImage.title || 'Updated Image',
        description: updatedImage.description || 'Beautiful transformation',
        likes: updatedImage.likes || Math.floor(Math.random() * 200) + 50,
        image: updatedImage.imageUrl || updatedImage.image,
        beforeAfter: updatedImage.beforeImage && updatedImage.afterImage ? {
          before: updatedImage.beforeImage,
          after: updatedImage.afterImage
        } : null
      };
      setGalleryImages(prev => prev.map(img => 
        (img.id === updatedImage._id || img._id === updatedImage._id) ? transformedImage : img
      ));
    });

    // Cleanup socket listeners on unmount
    return () => {
      socket.off('gallery:new');
      socket.off('gallery:delete');
      socket.off('gallery:update');
    };
  }, []);

  // Fallback gallery images function - ORIGINAL LOGIC RESTORED
  const getFallbackGalleryImages = () => [
    {
      id: 1,
      category: 'hair',
      title: 'Balayage Highlights',
      description: 'Natural looking highlights for summer',
      likes: 124,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      beforeAfter: {
        before: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
        after: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
      }
    },
    {
      id: 2,
      category: 'beard',
      title: 'Beard Trim & Shape',
      description: 'Professional beard grooming session',
      likes: 89,
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
      beforeAfter: {
        before: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
        after: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80'
      }
    },
    {
      id: 3,
      category: 'bridal',
      title: 'Wedding Day Styling',
      description: 'Complete bridal makeover',
      likes: 156,
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      beforeAfter: null
    },
    {
      id: 4,
      category: 'spa',
      title: 'Luxury Facial',
      description: 'Hydrating facial treatment',
      likes: 76,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      beforeAfter: null
    },
    {
      id: 5,
      category: 'hair',
      title: 'Color Correction',
      description: 'Transformation from dark to blonde',
      likes: 203,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      beforeAfter: {
        before: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
        after: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
      }
    },
    {
      id: 6,
      category: 'beard',
      title: 'Full Beard Treatment',
      description: 'Conditioning and styling',
      likes: 67,
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      beforeAfter: null
    },
    {
      id: 7,
      category: 'bridal',
      title: 'Traditional Bride',
      description: 'Cultural wedding styling',
      likes: 142,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      beforeAfter: null
    },
    {
      id: 8,
      category: 'hair',
      title: 'Men\'s Haircut',
      description: 'Modern fade haircut',
      likes: 98,
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
      beforeAfter: null
    },
  ];

  const updateField = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    if (bookingStep < 3) {
      setBookingStep(bookingStep + 1);
      return;
    }

    try {
      setBookingSubmitting(true);
      await createAppointment(formData);
      setBookingSuccess('Booking confirmed! We will contact you shortly.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        service: '',
        notes: ''
      });
      setBookingStep(1);
    } catch (err) {
      setBookingError(
        err?.response?.data?.error ||
          err?.response?.data?.errors?.[0]?.msg ||
          'Failed to submit booking. Please try again.'
      );
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Gallery Section Component - WITH SOCKET.IO INTEGRATION
  const GallerySection = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Get unique categories from gallery images
    const galleryCategories = [
      { id: 'all', name: 'All Work', count: galleryImages.length },
      ...Array.from(new Set(galleryImages.map(img => img.category)))
        .map(cat => ({
          id: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          count: galleryImages.filter(img => img.category === cat).length
        }))
    ];

    const filteredImages = galleryImages.filter(
      image => activeCategory === 'all' || image.category === activeCategory
    );

    const openLightbox = (image) => {
      setSelectedImage(image);
      setLightboxOpen(true);
    };

    const closeLightbox = () => {
      setLightboxOpen(false);
      setTimeout(() => setSelectedImage(null), 300);
    };

    if (galleryLoading) {
      return (
        <section id="gallery" className="py-20 px-6 md:px-8 bg-gradient-to-b from-white to-amber-50">
          <div className="max-w-7xl mx-auto text-center">
            <Loader className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading gallery...</p>
          </div>
        </section>
      );
    }

    return (
      <section id="gallery" className="py-20 px-6 md:px-8 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 mb-4">
              <Sparkles className="w-4 h-4 text-amber-600 mr-2" />
              <span className="text-amber-700 font-medium">Our Portfolio</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Beauty <span className="text-amber-600">Gallery</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our transformation stories and stunning results
            </p>

            {galleryError && (
              <div className="mt-4 text-amber-600 text-sm">
                {galleryError}
              </div>
            )}
          </div>

          {/* Gallery Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {galleryCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:text-amber-600 shadow-md hover:shadow-lg'
                }`}
              >
                <span className="relative z-10">{category.name}</span>
                <span className={`ml-2 text-sm px-2 py-1 rounded-full ${
                  activeCategory === category.id
                    ? 'bg-white/20'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {category.count}
                </span>
                
                {activeCategory === category.id && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600 to-rose-600 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white"
              >
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={image.image.startsWith('http') ? image.image : `${API_BASE_URL}${image.image}`}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                    onClick={() => openLightbox(image)}
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 capitalize">
                      {image.category}
                    </span>
                  </div>
                  
                  {/* Before/After Badge */}
                  {image.beforeAfter && (
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full text-sm font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Before/After
                      </span>
                    </div>
                  )}
                  
                  {/* Hover Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">{image.title}</h3>
                    <p className="text-white/90 mb-4">{image.description}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => openLightbox(image)}
                        className="flex-1 px-4 py-2 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
                      >
                        View Details
                      </button>
                      {image.beforeAfter && (
                        <button className="px-4 py-2 border border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors">
                          Compare
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Content Below Image */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{image.title}</h3>
                  <p className="text-gray-600 mb-4">{image.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-600">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">5.0</span>
                    </div>
                    
                    <a
                      href="#booking"
                      className="px-6 py-2 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Before/After Comparison Section */}
          {galleryImages.filter(img => img.beforeAfter).length > 0 && (
            <div className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Amazing <span className="text-amber-600">Transformations</span>
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  See the incredible before and after results from our satisfied clients
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {galleryImages
                  .filter(img => img.beforeAfter)
                  .slice(0, 2)
                  .map((image) => (
                    <div key={image.id} className="bg-white rounded-3xl shadow-xl overflow-hidden">
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{image.title}</h4>
                        <p className="text-gray-600 mb-6">{image.description}</p>
                        
                        <div className="relative h-64 rounded-2xl overflow-hidden">
                          <div className="absolute inset-0 flex">
                            <div className="flex-1 relative">
                              <img
                                src={image.beforeAfter.before}
                                alt="Before"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm">
                                Before
                              </div>
                            </div>
                            <div className="flex-1 relative">
                              <img
                                src={image.beforeAfter.after}
                                alt="After"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                                After
                              </div>
                            </div>
                          </div>
                          
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-move">
                              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Instagram Style Feed */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-3xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Follow Our Daily Work <span className="text-rose-500">@ngabo fashion hair saloon</span>
                </h3>
                <p className="text-gray-600">See behind the scenes and latest styles</p>
              </div>
              <a
                href="https://instagram.com/ngabofashion_hair_saloon"
                target=""
                rel="noopener noreferrer"
                className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Follow on Instagram
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {galleryImages.slice(0, 6).map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <img
                    src={img.image.startsWith('http') ? img.image : `${API_BASE_URL}${img.image}`}
                    alt={`Instagram post ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white mr-2" />
                    <span className="text-white font-medium">{img.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative max-w-6xl w-full">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Image */}
                <div className="flex-1">
                  <img
                    src={selectedImage.image.startsWith('http') ? selectedImage.image : `${API_BASE_URL}${selectedImage.image}`}
                    alt={selectedImage.title}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
                  />
                </div>

                {/* Image Details */}
                <div className="lg:w-96 bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                  <div className="mb-6">
                    <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-medium capitalize">
                      {selectedImage.category}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4">{selectedImage.title}</h3>
                  <p className="text-white/90 mb-6">{selectedImage.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-white">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400 mr-2" />
                      <span className="font-medium">5.0 Rating</span>
                    </div>
                    <div className="flex items-center text-white">
                      <Heart className="w-5 h-5 text-rose-400 mr-2" />
                      <span className="font-medium">{selectedImage.likes} Likes</span>
                    </div>
                    <div className="flex items-center text-white">
                      <User className="w-5 h-5 text-blue-400 mr-2" />
                      <span className="font-medium">Client Transformation</span>
                    </div>
                  </div>

                  {selectedImage.beforeAfter && (
                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-white mb-4">Transformation</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="aspect-video rounded-lg overflow-hidden mb-2">
                            <img
                              src={selectedImage.beforeAfter.before}
                              alt="Before"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-center text-white/80 text-sm">Before</p>
                        </div>
                        <div>
                          <div className="aspect-video rounded-lg overflow-hidden mb-2">
                            <img
                              src={selectedImage.beforeAfter.after}
                              alt="After"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-center text-white/80 text-sm">After</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                    Book Similar Service
                  </button>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <ChevronRightIcon className="w-6 h-6 text-white rotate-180" />
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <ChevronRightIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        )}
      </section>
    );
  };

  // Get selected service details
  const getSelectedService = () => {
    return services.find(s => s._id === formData.service || s.name === formData.service);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Navigation - KEEPING ORIGINAL DESIGN */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-rose-600 rounded-full flex items-center justify-center">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ngabo Fashion Hair Saloon</h1>
                <p className="text-sm text-amber-600">Premium Grooming</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#booking"
                className="px-6 py-2 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Book Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4 pt-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-amber-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Slider - KEEPING SLIDER FRONTEND */}
      <section id="home" className="pt-20 pb-16 px-6 md:px-8 relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200/30 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative order-2 md:order-1">
              {/* Hero Slider Container */}
              <div 
                className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] group"
                onMouseEnter={pauseAutoSlide}
                onMouseLeave={resumeAutoSlide}
              >
                {/* Slides */}
                <div className="relative h-full w-full">
                  {heroImages.map((image, index) => (
                    <div
                      key={image.id}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentSlide
                          ? 'opacity-100 translate-x-0'
                          : index < currentSlide
                          ? 'opacity-0 -translate-x-full'
                          : 'opacity-0 translate-x-full'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent">
                        {/* Slide Title Overlay */}
                        <div className={`absolute bottom-8 left-8 right-8 transition-all duration-500 delay-300 ${
                          index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                          <h3 className="text-2xl font-bold text-white mb-2">{image.title}</h3>
                          <p className="text-white/90">{image.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30"
                  aria-label="Next slide"
                >
                  <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-white w-8'
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Auto Play Indicator */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setAutoSlide(!autoSlide)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    aria-label={autoSlide ? "Pause slideshow" : "Play slideshow"}
                  >
                    {autoSlide ? (
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-3 bg-white animate-pulse"></div>
                        <div className="w-1 h-3 bg-white animate-pulse" style={{animationDelay: '150ms'}}></div>
                      </div>
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 text-white ml-0.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Floating Cards around the slider */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-sm hidden md:block" style={{animation: 'fadeInUp 0.8s ease-out'}}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Award Winning</h3>
                    <p className="text-sm text-gray-600">Best Salon 2023</p>
                  </div>
                </div>
                <p className="text-gray-600">Recognized for excellence in customer service and styling innovation.</p>
              </div>

              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl max-w-sm hidden lg:block" style={{animation: 'fadeInDown 0.8s ease-out'}}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">5-Star Rated</h3>
                    <p className="text-sm text-gray-600">500+ Happy Clients</p>
                  </div>
                </div>
                <p className="text-gray-600">Consistently rated excellent by our clients.</p>
              </div>
            </div>

            {/* Hero Content */}
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 text-amber-700 mb-6" style={{animation: 'fadeIn 0.8s ease-out'}}>
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="font-medium">Premium Experience</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight" style={{animation: 'slideUp 0.8s ease-out'}}>
                Elevate Your Style at <span className="text-amber-600">Ngabo Fashion Hair Saloon</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed" style={{animation: 'slideUp 0.8s ease-out', animationDelay: '200ms', animationFillMode: 'both'}}>
                Where artistry meets precision. Experience premium grooming services tailored just for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8" style={{animation: 'slideUp 0.8s ease-out', animationDelay: '400ms', animationFillMode: 'both'}}>
                <a
                  href="#booking"
                  className="px-8 py-4 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                >
                  Book Appointment
                  <div className="ml-2 transform group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </a>
                <a
                  href="#services"
                  className="px-8 py-4 border-2 border-amber-600 text-amber-600 rounded-full font-semibold text-lg hover:bg-amber-50 transition-all duration-300 text-center hover:border-amber-600 hover:text-amber-600"
                >
                  View Services
                </a>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12" style={{animation: 'fadeIn 0.8s ease-out', animationDelay: '600ms', animationFillMode: 'both'}}>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-transparent">
                  <div className="text-3xl font-bold text-amber-600">500+</div>
                  <div className="text-gray-600 text-sm mt-1">Happy Clients</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-transparent">
                  <div className="text-3xl font-bold text-rose-600">15+</div>
                  <div className="text-gray-600 text-sm mt-1">Expert Stylists</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-50">
                  <div className="text-3xl font-bold text-amber-600">98%</div>
                  <div className="text-gray-600 text-sm mt-1">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-rose-200/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-rose-200/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite_2s]"></div>

        {/* Animation Styles */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-pulse {
            animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </section>

      {/* Services Section - ORIGINAL LOGIC RESTORED */}
      <section id="services" className="py-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-amber-600">Premium</span> Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the finest grooming services with our expert stylists
            </p>
            
            {servicesError && (
              <div className="mt-4 text-amber-600 text-sm">
                {servicesError}
              </div>
            )}
          </div>

          {/* Service Filter */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex flex-wrap rounded-full bg-amber-50 p-2 gap-2">
              {['all', ...Array.from(new Set(services.map(s => s.category || s.id)))].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveService(type)}
                  className={`px-6 py-2 rounded-full font-medium capitalize transition-all ${
                    activeService === type
                      ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white'
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  {type === 'all' ? 'All Services' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {servicesLoading ? (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading services...</p>
            </div>
          ) : (
            /* Services Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter(service => activeService === 'all' || (service.category || service.id) === activeService)
                .map((service) => (
                  <div
                    key={service._id || service.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative overflow-hidden h-64">
                      <img
                        src={service.image || service.imageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800'}
                        alt={service.name || service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {service.popular && (
                        <div className="absolute top-4 right-4 px-4 py-1 bg-amber-600 text-white rounded-full text-sm font-medium">
                          Popular
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">{service.name || service.title}</h3>
                        {/* <span className="text-amber-600 font-bold">
                          ${service.price}
                        </span> */}
                      </div>
                      
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      
                      <div className="flex items-center text-gray-500 mb-6">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{service.duration}</span>
                      </div>
                      
                      {service.features && service.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {service.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <button 
                        onClick={() => {
                          setFormData(prev => ({ ...prev, service: service._id || service.id }));
                          window.location.href = '#booking';
                        }}
                        className="w-full py-3 border-2 border-amber-600 text-amber-600 rounded-full font-semibold hover:bg-amber-50 transition-all"
                      >
                        Book This Service
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      <GallerySection/>

      {/* Booking Section - ORIGINAL LOGIC RESTORED */}
      <section id="booking" className="py-20 px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mt-2 font-bold text-gray-900 mb-4">
              Book Your <span className="text-amber-600">Appointment</span>
            </h2>
            <p className="text-xl text-gray-600">Reserve your spot in just a few clicks</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Booking Steps */}
            <div className="flex justify-between mb-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
              {[1, 2, 3].map((step) => (
                <div key={step} className="relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step <= bookingStep
                      ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step === bookingStep ? (
                      <div className="w-6 h-6 bg-white rounded-full" />
                    ) : step < bookingStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step
                    )}
                  </div>
                  <div className="mt-2 text-sm font-medium">
                    {step === 1 && 'Details'}
                    {step === 2 && 'Time'}
                    {step === 3 && 'Confirm'}
                  </div>
                </div>
              ))}
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBooking}>
              {bookingStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-6">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={updateField('name')}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={updateField('phone')}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={updateField('email')}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Select Service</label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={formData.service}
                        onChange={updateField('service')}
                        required
                      >
                        <option value="">Select a service</option>
                        {services.map(service => (
                          <option key={service._name || service.name} value={service._name || service.name}>
                            {service.name || service.title} - ${service.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-6">Select Date & Time</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">Preferred Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={updateField('date')}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Preferred Time</label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                        value={formData.time}
                        onChange={updateField('time')}
                        required
                      >
                        <option value="">Select time</option>
                        {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-amber-600 to-rose-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Confirm Your Booking</h3>
                  <p className="text-gray-600 mb-8">
                    Please review your details and confirm your appointment
                  </p>
                  
                  <div className="bg-amber-50 rounded-2xl p-6 mb-8 text-left">
                    <h4 className="font-bold text-lg mb-4">Booking Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-semibold">
                          {getSelectedService()?.name || getSelectedService()?.title || formData.service}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold">{formData.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold">{formData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold">{formData.email}</span>
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span className="text-amber-600">
                            ${getSelectedService()?.price || '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {bookingStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setBookingStep(bookingStep - 1)}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {bookingSubmitting
                    ? 'Submitting...'
                    : bookingStep === 3
                      ? 'Confirm Booking'
                      : 'Continue'}
                </button>
              </div>
            </form>

            {(bookingError || bookingSuccess) && (
              <div className="mt-6">
                {bookingError && (
                  <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200">
                    {bookingError}
                  </div>
                )}
                {bookingSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {bookingSuccess}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer - ORIGINAL LOGIC RESTORED */}
      <footer className="bg-gray-900 text-white py-12 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & About */}
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
                Elevating your style with precision and artistry since 2010.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/ngabofashion_hair_saloon" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/ngabo.hodal" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://wa.me/250781216840" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <FaWhatsapp className="w-5 h-5" />
                </a>
                 <a href="https://www.tiktok.com/@ngabofashion" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                  <SiTiktok className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-6">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-amber-400 mr-3" />
                  <span className="text-gray-400">Kigali City/Makuza building </span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-amber-400 mr-3" />
                  <span className="text-gray-400">+250 781 216 840</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-amber-400 mr-3" />
                  <span className="text-gray-400">Mon-Sat: 9AM-9PM</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <div className="space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-bold mb-6">Stay Updated</h3>
              <p className="text-gray-400 mb-4">
                Subscribe for special offers and styling tips
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 bg-gray-800 rounded-l-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button className="px-6 bg-gradient-to-r from-amber-600 to-rose-600 rounded-r-full font-semibold hover:opacity-90 transition-opacity">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 Ngabo Saloon. All rights reserved.</p>
            <p className="mt-2 text-sm mb-10">Crafted with ❤️ for exceptional grooming experiences</p>
            <a 
              href="/admin/login" 
              className="inline-block text-white bg-amber-600 hover:bg-amber-700 focus:ring-4 focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-colors"
            >
              Admin Login
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
