import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, CheckCircle, XCircle, Loader2, X, Calendar, User, Scissors, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  fetchAllTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from '../../api/testimonials';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    rating: 5,
    comment: '',
    approved: true
  });

  // Fetch testimonials
  const fetchTestimonialsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchAllTestimonials();
      console.log('Fetched testimonials:', data);
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials. Please try again.');
      // Fallback data
      setTestimonials([
        { _id: 1, name: 'Robert Johnson', service: 'Haircut', rating: 5, comment: 'Best salon experience ever! The team is professional and the service is outstanding.', date: '2024-01-15', approved: true },
        { _id: 2, name: 'Sarah Wilson', service: 'Beard Trim', rating: 4, comment: 'Great haircut and friendly staff. Will definitely come back!', date: '2024-01-12', approved: true },
        { _id: 3, name: 'Michael Brown', service: 'Hair Color', rating: 5, comment: 'Exceptional beard trim service. The attention to detail is remarkable.', date: '2024-01-10', approved: false },
        { _id: 4, name: 'Emma Davis', service: 'Hairstyle', rating: 5, comment: 'Love the new hairstyle! The colorist did an amazing job.', date: '2024-01-08', approved: true },
        { _id: 5, name: 'James Miller', service: 'Haircut', rating: 4, comment: 'Good service, reasonable prices. Clean and professional environment.', date: '2024-01-05', approved: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonialsData();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      service: '',
      rating: 5,
      comment: '',
      approved: true
    });
    setEditingTestimonial(null);
  };

  // Open add form
  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  // Open edit form
  const openEditForm = (testimonial) => {
    setFormData({
      name: testimonial.name || '',
      service: testimonial.service || '',
      rating: testimonial.rating || 5,
      comment: testimonial.comment || '',
      approved: testimonial.approved || true
    });
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  // Open detail view
  const openDetailView = (testimonial) => {
    const index = filteredTestimonials.findIndex(t => t._id === testimonial._id);
    if (index !== -1) {
      setCurrentDetailIndex(index);
      setShowDetail(true);
    }
  };

  // Navigate to previous testimonial in detail view
  const navigateToPrevious = () => {
    if (currentDetailIndex > 0) {
      setCurrentDetailIndex(currentDetailIndex - 1);
    }
  };

  // Navigate to next testimonial in detail view
  const navigateToNext = () => {
    if (currentDetailIndex < filteredTestimonials.length - 1) {
      setCurrentDetailIndex(currentDetailIndex + 1);
    }
  };

  // Get current testimonial for detail view
  const getCurrentTestimonial = () => {
    return filteredTestimonials[currentDetailIndex];
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.service.trim() || !formData.comment.trim()) {
      alert('Please fill in all required fields (name, service, comment)');
      return;
    }

    setFormSubmitting(true);

    try {
      if (editingTestimonial) {
        // Update testimonial
        const updatedTestimonial = await updateTestimonial(editingTestimonial._id, formData);
        setTestimonials(testimonials.map(t => 
          t._id === editingTestimonial._id ? updatedTestimonial : t
        ));
      } else {
        // Create new testimonial
        const newTestimonial = await createTestimonial(formData);
        setTestimonials([newTestimonial, ...testimonials]);
      }
      
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error saving testimonial:', err);
      alert(`Failed to save testimonial: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle delete
  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter(t => t._id !== id));
      // Close detail view if the deleted testimonial was being viewed
      if (showDetail && getCurrentTestimonial()?._id === id) {
        setShowDetail(false);
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      alert('Failed to delete testimonial. Please try again.');
    }
  };

  // Toggle approval status
  const toggleApprovalStatus = async (id, currentStatus) => {
    try {
      const updatedTestimonial = await updateTestimonial(id, {
        approved: !currentStatus
      });
      
      setTestimonials(testimonials.map(t => 
        t._id === id ? updatedTestimonial : t
      ));
    } catch (err) {
      console.error('Error updating testimonial status:', err);
      alert('Failed to update testimonial status. Please try again.');
    }
  };

  // Render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
      />
    ));
  };

  // Render stars for detail view
  const renderDetailStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={24} 
        className={i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
      />
    ));
  };

  // Filter testimonials based on status
  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'approved') return testimonial.approved;
    if (filterStatus === 'pending') return !testimonial.approved;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">Manage customer reviews and feedback</p>
        </div>
        <button 
          onClick={openAddForm}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-full transition-all ${filterStatus === 'all' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All ({testimonials.length})
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-4 py-2 rounded-full transition-all ${filterStatus === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Approved ({testimonials.filter(t => t.approved).length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-full transition-all ${filterStatus === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Pending ({testimonials.filter(t => !t.approved).length})
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Testimonials List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-amber-500" size={32} />
          <span className="ml-3 text-gray-600">Loading testimonials...</span>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-amber-50 rounded-2xl border border-amber-100">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
            <Star className="text-amber-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No testimonials found</h3>
          <p className="text-gray-600 mb-6">{filterStatus !== 'all' ? `No ${filterStatus} testimonials` : 'Add your first testimonial to get started'}</p>
          <button 
            onClick={openAddForm}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
          >
            <Plus size={20} />
            Add Testimonial
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Showing {filteredTestimonials.length} of {testimonials.length} testimonials {filterStatus !== 'all' && `(${filterStatus})`}
          </div>
          
          <div className="space-y-6">
            {filteredTestimonials.map((testimonial) => (
              <div 
                key={testimonial._id} 
                onClick={() => openDetailView(testimonial)}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                        <div className="flex items-center gap-1">{renderStars(testimonial.rating)}</div>
                        <span className="text-sm text-gray-500">{new Date(testimonial.date || testimonial.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600">{testimonial.comment}</p>
                      <p className="text-gray-500 text-sm mt-1"><strong>Service:</strong> {testimonial.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleApprovalStatus(testimonial._id, testimonial.approved)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${testimonial.approved ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
                    >
                      {testimonial.approved ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {testimonial.approved ? 'Approved' : 'Pending'}
                    </button>
                    <button onClick={() => openEditForm(testimonial)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDeleteTestimonial(testimonial._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Testimonial Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={formSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    placeholder="e.g., John Doe"
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
                  <input
                    type="text"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    disabled={formSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    placeholder="e.g., Haircut, Beard Trim"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(r => (
                      <button key={r} type="button" onClick={() => handleRatingChange(r)} disabled={formSubmitting} className="p-2 hover:bg-amber-50 rounded-lg transition-colors">
                        <Star size={24} className={r <= formData.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"} />
                      </button>
                    ))}
                    <span className="ml-3 text-lg font-semibold text-gray-900">{formData.rating} out of 5</span>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment *</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    required
                    disabled={formSubmitting}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                    placeholder="Write the customer's testimonial here..."
                  />
                </div>

                {/* Approval */}
                <div className="flex items-center">
                  <input type="checkbox" id="approved" name="approved" checked={formData.approved} onChange={handleInputChange} disabled={formSubmitting} className="h-5 w-5 text-amber-500 rounded focus:ring-amber-500 disabled:opacity-50"/>
                  <label htmlFor="approved" className="ml-3 flex items-center gap-2">
                    {formData.approved ? <CheckCircle className="text-green-600" size={16} /> : <XCircle className="text-yellow-600" size={16} />}
                    <span className="text-sm font-medium text-gray-700">Mark as Approved</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button type="button" onClick={() => { setShowForm(false); resetForm(); }} disabled={formSubmitting} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={formSubmitting} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center gap-2">
                    {formSubmitting && <Loader2 size={20} className="animate-spin" />}
                    {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Detail View Modal */}
      {showDetail && getCurrentTestimonial() && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Testimonial Details</h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-2xl">
                  {getCurrentTestimonial().name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{getCurrentTestimonial().name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">{renderDetailStars(getCurrentTestimonial().rating)}</div>
                    <span className="text-lg font-semibold text-amber-600">{getCurrentTestimonial().rating}/5</span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Service */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Scissors size={20} className="text-amber-600" />
                    <span className="text-sm font-medium text-gray-700">Service</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{getCurrentTestimonial().service}</p>
                </div>

                {/* Date */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={20} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Date</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(getCurrentTestimonial().date || getCurrentTestimonial().createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Status */}
                <div className={`p-4 rounded-xl ${getCurrentTestimonial().approved ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-yellow-50 to-amber-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getCurrentTestimonial().approved ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-yellow-600" />}
                    <span className="text-sm font-medium text-gray-700">Status</span>
                  </div>
                  <p className={`text-lg font-semibold ${getCurrentTestimonial().approved ? 'text-green-700' : 'text-yellow-700'}`}>
                    {getCurrentTestimonial().approved ? 'Approved' : 'Pending'}
                  </p>
                </div>

                {/* ID */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={20} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Testimonial ID</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{getCurrentTestimonial()._id}</p>
                </div>
              </div>

              {/* Comment */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={20} className="text-amber-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Customer Feedback</h4>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-amber-50 p-6 rounded-xl border border-amber-100">
                  <p className="text-gray-700 leading-relaxed">{getCurrentTestimonial().comment}</p>
                </div>
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
                    {currentDetailIndex + 1} of {filteredTestimonials.length}
                  </span>
                  <button
                    onClick={navigateToNext}
                    disabled={currentDetailIndex === filteredTestimonials.length - 1}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleApprovalStatus(getCurrentTestimonial()._id, getCurrentTestimonial().approved)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${getCurrentTestimonial().approved ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                  >
                    {getCurrentTestimonial().approved ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    {getCurrentTestimonial().approved ? 'Mark as Pending' : 'Approve'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDetail(false);
                      openEditForm(getCurrentTestimonial());
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this testimonial?')) {
                        handleDeleteTestimonial(getCurrentTestimonial()._id);
                        setShowDetail(false);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                    Delete
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