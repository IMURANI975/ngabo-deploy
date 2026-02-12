// api/dashboard.js
import { api } from './api'; // Assuming api is an axios instance with baseURL set

// Fetch overall dashboard stats
export const fetchDashboardStats = async () => {
  try {
    const { data } = await api.get('/dashboard/stats');
    return data?.data || null;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Fetch dashboard overview
export const fetchDashboardOverview = async () => {
  try {
    const { data } = await api.get('/dashboard/overview');
    return data?.data || null;
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    throw error;
  }
};

// Fetch recent activity (limit default to 10)
export const fetchRecentActivity = async (limit = 10) => {
  try {
    const { data } = await api.get(`/dashboard/recent-activity?limit=${limit}`);
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

// Fetch today's appointments
export const fetchTodayAppointments = async () => {
  try {
    const { data } = await api.get('/dashboard/today-appointments');
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching today appointments:', error);
    throw error;
  }
};

// Fetch top services
export const fetchTopServices = async () => {
  try {
    const { data } = await api.get('/dashboard/top-services');
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching top services:', error);
    throw error;
  }
};

// Fetch top customers
export const fetchTopCustomers = async () => {
  try {
    const { data } = await api.get('/dashboard/top-customers');
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching top customers:', error);
    throw error;
  }
};

// Fetch appointment stats
export const fetchAppointmentStats = async () => {
  try {
    const { data } = await api.get('/dashboard/appointment-stats');
    return data?.data || null;
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    throw error;
  }
};

// Fetch weekly revenue
export const fetchWeeklyRevenue = async () => {
  try {
    const { data } = await api.get('/dashboard/revenue/weekly');
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching weekly revenue:', error);
    throw error;
  }
};

// Fetch monthly revenue
export const fetchMonthlyRevenue = async () => {
  try {
    const { data } = await api.get('/dashboard/revenue/monthly');
    return data?.data || [];
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    throw error;
  }
};
