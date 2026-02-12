import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, RefreshCw, X, Star, Upload } from 'lucide-react';
import { 
  fetchAllServices, 
  createService, 
  updateService, 
  deleteService 
} from '../../api/services';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    // price: '',
    duration: '',
    category: 'hair',
    features: [''],
    imageFile: null,
    popular: false
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const categories = ['hair', 'beard', 'spa', 'nails', 'bridal', 'kids'];

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAllServices();
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      // price: '',
      duration: '',
      category: 'hair',
      features: [''],
      imageFile: null,
      popular: false
    });
    setPreviewUrl('');
    setEditingService(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setFormData({
      name: service.name || '',
      description: service.description || '',
      // price: service.price || '',
      duration: service.duration || '',
      category: service.category || 'hair',
      features: service.features && service.features.length > 0 ? service.features : [''],
      imageFile: null,
      popular: service.popular || false
    });
    
    if (service.image) {
      setPreviewUrl(service.image);
    }
    
    setEditingService(service);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeatureField = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('description', formData.description);
      // submissionData.append('price', formData.price);
      submissionData.append('duration', formData.duration);
      submissionData.append('category', formData.category);
      submissionData.append('popular', formData.popular);
      
      const filteredFeatures = formData.features.filter(f => f.trim() !== '');
      submissionData.append('features', JSON.stringify(filteredFeatures));
      
      if (formData.imageFile) {
        submissionData.append('image', formData.imageFile);
      }

      if (editingService) {
        const updatedService = await updateService(editingService._id, submissionData);
        setServices(services.map(s => 
          s._id === editingService._id ? updatedService : s
        ));
      } else {
        const newService = await createService(submissionData);
        setServices([newService, ...services]);
      }
      
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error saving service:', err);
      alert(`Failed to save service: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await deleteService(id);
      setServices(services.filter(service => service._id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
      alert(`Failed to delete service: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  const togglePopularStatus = async (id, currentStatus) => {
    try {
      const formData = new FormData();
      const service = services.find(s => s._id === id);
      formData.append('name', service.name);
      formData.append('description', service.description);
      // formData.append('price', service.price);
      formData.append('duration', service.duration);
      formData.append('category', service.category);
      formData.append('popular', !currentStatus);
      formData.append('features', JSON.stringify(service.features || []));
      
      const updatedService = await updateService(id, formData);
      setServices(services.map(service => 
        service._id === id ? updatedService : service
      ));
    } catch (err) {
      console.error('Error updating service status:', err);
      alert(`Failed to update service status: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const serviceCategories = ['all', ...new Set(services.map(service => service.category))];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage your salon services and pricing</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchServices}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button 
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
          >
            <Plus size={20} />
            Add New Service
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {serviceCategories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-amber-500" size={32} />
            <span className="ml-3 text-gray-600">Loading services...</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try changing your search or filter criteria' 
                : 'Add your first service to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Service Name</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Category</th>
                  {/* <th className="text-left py-3 px-4 text-gray-600 font-medium">Price</th> */}
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Image</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {service.popular && (
                          <Star size={16} className="text-amber-500 fill-amber-500" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{service.name}</div>
                          {service.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {service.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        {service.category}
                      </span>
                    </td>
                    {/* <td className="py-4 px-4 font-semibold text-gray-900">
                      {service.price}
                    </td> */}
                    <td className="py-4 px-4">
                      {service.image ? (
                        <img 
                          src={service.image} 
                          alt={service.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect width="48" height="48" fill="%23f3f4f6"/%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400 text-xs">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{service.duration}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => togglePopularStatus(service._id, service.popular)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                          service.popular 
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {service.popular && <Star size={12} className="fill-amber-800" />}
                        {service.popular ? 'Popular' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditForm(service)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit service"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteService(service._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete service"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
            <div>
              Showing {filteredServices.length} of {services.length} services
            </div>
            <div>
              {searchTerm && `Results for: "${searchTerm}"`}
            </div>
          </div>
        )}
      </div>

      {/* Service Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={formSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                      placeholder="e.g., Haircut, Facial"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={formSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      disabled={formSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                      placeholder="e.g., $25, $45"
                    />
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      disabled={formSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                      placeholder="e.g., 30min, 1h"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    disabled={formSubmitting}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    placeholder="Describe the service in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Image {editingService && '(Upload new to replace)'}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-amber-400 transition-colors">
                    <div className="space-y-1 text-center">
                      {previewUrl ? (
                        <div className="relative">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="mx-auto h-32 w-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, imageFile: null }));
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
                              htmlFor="service-image-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="service-image-upload"
                                name="service-image-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleFileChange}
                                disabled={formSubmitting}
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

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Features
                    </label>
                    <button
                      type="button"
                      onClick={addFeatureField}
                      disabled={formSubmitting}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium disabled:opacity-50"
                    >
                      + Add Feature
                    </button>
                  </div>
                  
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        disabled={formSubmitting}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureField(index)}
                          disabled={formSubmitting}
                          className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl disabled:opacity-50"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="popular"
                    name="popular"
                    checked={formData.popular}
                    onChange={handleInputChange}
                    disabled={formSubmitting}
                    className="h-5 w-5 text-amber-500 rounded focus:ring-amber-500 disabled:opacity-50"
                  />
                  <label htmlFor="popular" className="ml-3 flex items-center gap-2">
                    <Star size={16} className="text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Mark as Popular Service
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    disabled={formSubmitting}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {formSubmitting && <Loader2 size={20} className="animate-spin" />}
                    {editingService ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}