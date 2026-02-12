import React, { useState, useEffect } from 'react';
import {
  Plus, Image as ImageIcon, Trash2, Eye, Download, X, Upload,
  Calendar, Tag, ChevronLeft, ChevronRight, ExternalLink, FileImage
} from 'lucide-react';
import { io } from 'socket.io-client';

// API functions
import {
  fetchAllGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage
} from '../../api/gallery';

// 🔌 SOCKET.IO CONNECTION
const socket = io('http://localhost:5000');

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'hair',
    description: '',
    imageFile: null
  });
  const [previewUrl, setPreviewUrl] = useState('');

  const API_BASE_URL = 'http://localhost:5000';
  const categories = ['all', 'hair', 'beard', 'bridal', 'spa'];

  // Fetch images from server
  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllGalleryImages();
      setImages(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load gallery images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // SOCKET.IO LISTENERS FOR REAL-TIME UPDATES
  useEffect(() => {
    fetchImages();

    socket.on('gallery:new', (newImage) => {
      setImages(prev => [newImage, ...prev]);
    });

    socket.on('gallery:delete', (id) => {
      setImages(prev => prev.filter(img => img._id !== id));
      if (showDetail && getCurrentImage()?._id === id) {
        setShowDetail(false);
      }
    });

    socket.on('gallery:update', (updatedImage) => {
      setImages(prev => prev.map(img => img._id === updatedImage._id ? updatedImage : img));
    });

    return () => {
      socket.off('gallery:new');
      socket.off('gallery:delete');
      socket.off('gallery:update');
    };
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadForm(prev => ({ ...prev, imageFile: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const resetUploadForm = () => {
    setUploadForm({ title: '', category: 'hair', description: '', imageFile: null });
    setPreviewUrl('');
  };

  const openDetailView = (image) => {
    const index = filteredImages.findIndex(img => img._id === image._id);
    if (index !== -1) {
      setCurrentDetailIndex(index);
      setShowDetail(true);
    }
  };

  const navigateToPrevious = () => {
    if (currentDetailIndex > 0) setCurrentDetailIndex(currentDetailIndex - 1);
  };

  const navigateToNext = () => {
    if (currentDetailIndex < filteredImages.length - 1) setCurrentDetailIndex(currentDetailIndex + 1);
  };

  const getCurrentImage = () => filteredImages[currentDetailIndex];

  // Handle image upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      alert('Please enter a title for the image');
      return;
    }
    if (!uploadForm.imageFile) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('category', uploadForm.category.toLowerCase());
      formData.append('description', uploadForm.description);
      formData.append('image', uploadForm.imageFile);

      await uploadGalleryImage(formData);
      // no manual setImages, socket will update automatically
      setShowUploadForm(false);
      resetUploadForm();
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle image delete
  const handleDeleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await deleteGalleryImage(id);
      // socket will handle UI removal
    } catch (err) {
      console.error(err);
      alert('Failed to delete image.');
    }
  };

  // Preview image in new tab
  const handlePreview = (imageUrl) => {
    window.open(`${API_BASE_URL}${imageUrl}`, '_blank');
  };

  // Download image
  const handleDownload = async (imageUrl, title) => {
    try {
      const response = await fetch(`${API_BASE_URL}${imageUrl}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to download image.');
    }
  };

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600">Manage your salon portfolio and images</p>
        </div>
        <button 
          onClick={() => setShowUploadForm(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
        >
          <Plus size={20} />
          Upload Image
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all capitalize ${
              selectedCategory === category 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <span className="ml-3 text-gray-600">Loading gallery...</span>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-amber-50 rounded-2xl border border-amber-100">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
            <ImageIcon className="text-amber-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600 mb-6">
            {selectedCategory !== 'all' 
              ? `No images in ${selectedCategory} category` 
              : 'Add your first image to get started'}
          </p>
          <button 
            onClick={() => setShowUploadForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
          >
            <Upload size={20} />
            Upload Image
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredImages.length} of {images.length} images
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div 
                key={image._id} 
                onClick={() => openDetailView(image)}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={image.image.startsWith('http') ? image.image : `${API_BASE_URL}${image.image}`}
                    alt={image.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="%239ca3af"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handlePreview(image.image)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                          title="Preview in new tab"
                        >
                          <Eye size={18} className="text-gray-800" />
                        </button>
                        <button 
                          onClick={() => handleDownload(image.image, image.title)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                          title="Download"
                        >
                          <Download size={18} className="text-gray-800" />
                        </button>
                        <button 
                          onClick={() => handleDeleteImage(image._id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{image.title}</h3>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full capitalize">
                      {image.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={14} />
                    <span>{new Date(image.date || image.createdAt).toLocaleDateString()}</span>
                  </div>
                  {image.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{image.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Upload Image Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upload Image</h2>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    resetUploadForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                {/* Image File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image File *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-amber-400 transition-colors">
                    <div className="space-y-1 text-center">
                      {previewUrl ? (
                        <div className="relative">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="mx-auto h-48 w-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setUploadForm(prev => ({ ...prev, imageFile: null }));
                              setPreviewUrl('');
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleFileChange}
                                disabled={uploading}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF, WebP up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    placeholder="e.g., Hair Style #1"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={uploadForm.category}
                    onChange={handleInputChange}
                    disabled={uploading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 capitalize"
                  >
                    {categories.filter(c => c !== 'all').map((category) => (
                      <option key={category} value={category} className="capitalize">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={uploadForm.description}
                    onChange={handleInputChange}
                    disabled={uploading}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    placeholder="Brief description of the image..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadForm(false);
                      resetUploadForm();
                    }}
                    disabled={uploading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !uploadForm.imageFile}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    )}
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Detail View Modal */}
      {showDetail && getCurrentImage() && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Image Details</h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Main Image */}
              <div className="mb-8">
                <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <img 
                    src={getCurrentImage().image} 
                    alt={getCurrentImage().title}
                    className="w-full h-auto max-h-[500px] object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="%239ca3af"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handlePreview(getCurrentImage().image)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                      title="Open in new tab"
                    >
                      <ExternalLink size={20} className="text-gray-800" />
                    </button>
                    <button 
                      onClick={() => handleDownload(getCurrentImage().image, getCurrentImage().title)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg"
                      title="Download"
                    >
                      <Download size={20} className="text-gray-800" />
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title and Category */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FileImage size={20} className="text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">Image Title</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{getCurrentImage().title}</h3>
                    <div className="mt-3 flex items-center gap-2">
                      <Tag size={16} className="text-amber-600" />
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full capitalize">
                        {getCurrentImage().category}
                      </span>
                    </div>
                  </div>

                  {/* Date and ID */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={20} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Upload Date</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(getCurrentImage().date || getCurrentImage().createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <div className="mt-3 text-sm text-gray-500">
                      <span className="font-medium">ID:</span> {getCurrentImage()._id}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {getCurrentImage().description && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FileImage size={20} className="text-gray-600" />
                      <h4 className="text-lg font-semibold text-gray-900">Description</h4>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-amber-50 p-5 rounded-xl border border-amber-100">
                      <p className="text-gray-700 leading-relaxed">{getCurrentImage().description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation and Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                {/* Navigation */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={navigateToPrevious}
                    disabled={currentDetailIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    {currentDetailIndex + 1} of {filteredImages.length}
                  </span>
                  <button
                    onClick={navigateToNext}
                    disabled={currentDetailIndex === filteredImages.length - 1}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePreview(getCurrentImage().image)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
                  >
                    <ExternalLink size={16} />
                    View Original
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this image?')) {
                        handleDeleteImage(getCurrentImage()._id);
                        setShowDetail(false);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                    Delete Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}