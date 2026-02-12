import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Calendar, DollarSign, Plus, 
  MessageSquare, Clock, Scissors, Package, Mail, Star, UserPlus 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  fetchDashboardStats,
  fetchTodayAppointments,
  fetchTopServices,
  fetchRecentActivity
} from '../api/dashboard';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    newCustomers: 0,
    todayAppointments: 0,
    growthRate: 0,
    pendingMessages: 0,
    completedAppointments: 0,
    activeServices: 0,
    totalClients: 0
  });
  const [todayAppointmentsList, setTodayAppointmentsList] = useState([]);
  const [topServicesList, setTopServicesList] = useState([]);
  const [recentActivityList, setRecentActivityList] = useState([]);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, todayData, topServicesData, recentActivityData] = await Promise.all([
        fetchDashboardStats(),
        fetchTodayAppointments(),
        fetchTopServices(),
        fetchRecentActivity(5)
      ]);

      if (statsData) setStats(statsData);
      if (todayData) setTodayAppointmentsList(todayData);
      if (topServicesData) setTopServicesList(topServicesData);
      if (recentActivityData) setRecentActivityList(recentActivityData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format time for recent activity
  const formatTime = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 60000);
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Add Service',
      icon: <Plus className="text-blue-600" size={20} />,
      link: '/admin/services',
      description: 'Create new salon service'
    },
    {
      title: 'Schedule',
      icon: <Calendar className="text-green-600" size={20} />,
      link: '/admin/appointments',
      description: 'Manage appointments'
    },
    {
      title: 'Messages',
      icon: <MessageSquare className="text-purple-600" size={20} />,
      link: '/admin/contacts',
      description: `${stats.pendingMessages} pending messages`
    },
    {
      title: 'Add Gallery',
      icon: <Plus className="text-amber-600" size={20} />,
      link: '/admin/gallery',
      description: 'Upload new images'
    },
    {
      title: 'Add Testimonial',
      icon: <Star className="text-pink-600" size={20} />,
      link: '/admin/testimonials',
      description: 'Manage customer reviews'
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your salon today.
          <span className="ml-2 text-sm text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        {/* <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-50">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <span className="text-sm font-medium text-green-600">+{stats.growthRate}%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {loading ? '...' : formatCurrency(stats.totalRevenue)}
          </h3>
          <p className="text-gray-600 text-sm">Total Revenue</p>
        </div> */}

        {/* New Customers */}
        {/* <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <UserPlus className="text-blue-600" size={24} />
            </div>
            <span className="text-sm font-medium text-blue-600">+8.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.newCustomers}</h3>
          <p className="text-gray-600 text-sm">New Customers</p>
        </div> */}

        {/* Today's Appointments */}
        {/* <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-50">
              <Calendar className="text-amber-600" size={24} />
            </div>
            <span className="text-sm font-medium text-amber-600">+5.7%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.todayAppointments}</h3>
          <p className="text-gray-600 text-sm">Today's Appointments</p>
        </div> */}

        {/* Growth Rate */}
        {/* <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-50">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <span className="text-sm font-medium text-purple-600">+3.4%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{loading ? '...' : `${stats.growthRate}%`}</h3>
          <p className="text-gray-600 text-sm">Growth Rate</p>
        </div> */}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-7">
          {quickActions.map((action, index) => (
            <Link 
              key={index}
              to={action.link}
              className="bg-white rounded-xl p-2 w-38 text-left hover:shadow-lg transition-all border border-gray-200 hover:border-blue-300 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">{action.icon}</div>
                <div className="font-medium text-gray-900">{action.title}</div>
              </div>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Today's Appointments & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Today's Appointments</h2>
            <span className="text-sm text-gray-500">{todayAppointmentsList.length} appointments</span>
          </div>
          <div className="space-y-3">
            {todayAppointmentsList.map((appointment) => (
              <div key={appointment._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Clock className="text-amber-600" size={18} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{appointment.customerName}</div>
                    <div className="text-sm text-gray-500">{appointment.serviceName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link 
            to="/admin/appointments"
            className="block text-center text-blue-600 hover:text-blue-700 font-medium py-4 mt-4 border-t border-gray-100"
          >
            View all appointments →
          </Link>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Services</h2>
            <span className="text-sm text-gray-500">This month</span>
          </div>
          <div className="space-y-4">
            {topServicesList.map((service, index) => (
              <div key={service._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-bold">{index + 1}</div>
                  <div>
                    <div className="font-medium text-gray-900">{service._id}</div>
                    <div className="text-xs text-gray-500">{service.bookings} bookings</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{formatCurrency(service.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
          <Link 
            to="/admin/services"
            className="block text-center text-blue-600 hover:text-blue-700 font-medium py-4 mt-4 border-t border-gray-100"
          >
            View all services →
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-amber-50 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all activity</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentActivityList.map((activity) => (
            <div key={activity._id} className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  {activity.type === 'appointment' && <Calendar className="text-green-600" size={18} />}
                  {activity.type === 'contact' && <Mail className="text-blue-600" size={18} />}
                  {activity.type === 'testimonial' && <Star className="text-amber-600" size={18} />}
                </div>
                <span className="font-medium text-gray-900">{activity.action}</span>
              </div>
              <p className="text-gray-600 text-sm">{activity.user}</p>
              <span className="text-xs text-gray-400 mt-2 block">{formatTime(activity.time)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
