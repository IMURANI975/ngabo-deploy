import Service from '../models/Service.js';
import Appointment from '../models/Appointment.js';
import Testimonial from '../models/Testimonial.js';
import Contact from '../models/Contact.js';
import DashboardMetrics from '../models/Dashboard.js';

/* ================================
   DASHBOARD STATISTICS
================================ */
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStart = new Date(thirtyDaysAgo.setHours(0, 0, 0, 0));

    const [
      todayAppointments,
      completedAppointments,
      totalClients,
      newCustomers,
      pendingMessages,
      activeServices
    ] = await Promise.all([
      Appointment.countDocuments({ date: { $gte: startOfToday } }),
      Appointment.countDocuments({ status: 'completed', date: { $gte: startOfMonth } }),
      Appointment.distinct('customerEmail').then(e => e.length),
      Appointment.distinct('customerEmail', { createdAt: { $gte: thirtyDaysAgoStart } }).then(e => e.length),
      Contact.countDocuments({ status: 'new' }),
      Service.countDocuments({ isActive: true })
    ]);

    const revenueData = await Appointment.aggregate([
      { $match: { status: 'completed', date: { $gte: startOfMonth } } },
      { $group: { _id: null, totalRevenue: { $sum: '$servicePrice' }, count: { $sum: 1 } } }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    const appointmentCount = revenueData[0]?.count || 0;

    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const lastMonthRevenueData = await Appointment.aggregate([
      { $match: { status: 'completed', date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, totalRevenue: { $sum: '$servicePrice' } } }
    ]);

    const lastMonthRevenue = lastMonthRevenueData[0]?.totalRevenue || 0;
    const growthRate = lastMonthRevenue > 0
      ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : totalRevenue > 0 ? 100 : 0;

    await DashboardMetrics.getTodayMetrics?.();

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        newCustomers,
        todayAppointments,
        growthRate: Number(growthRate),
        pendingMessages,
        completedAppointments,
        activeServices,
        totalClients,
        appointmentCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

/* ================================
   RECENT ACTIVITY
================================ */
const formatTime = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
  return `${Math.floor(diff / 1440)} days ago`;
};

export const getRecentActivity = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const [appointments, testimonials, contacts] = await Promise.all([
      Appointment.find().sort({ createdAt: -1 }).limit(limit).lean(),
      Testimonial.find().sort({ createdAt: -1 }).limit(limit).lean(),
      Contact.find().sort({ createdAt: -1 }).limit(limit).lean()
    ]);

    const activities = [
      ...appointments.map(a => ({
        _id: a._id,
        type: 'appointment',
        user: a.customerName,
        action: `New appointment booked: ${a.serviceName}`,
        status: a.status,
        time: formatTime(a.createdAt)
      })),
      ...testimonials.map(t => ({
        _id: t._id,
        type: 'testimonial',
        user: t.name,
        action: `New testimonial added`,
        rating: t.rating,
        time: formatTime(t.createdAt)
      })),
      ...contacts.map(c => ({
        _id: c._id,
        type: 'contact',
        user: c.name,
        action: `New message: ${c.subject}`,
        status: c.status,
        time: formatTime(c.createdAt)
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, limit);

    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      error: error.message
    });
  }
};

/* ================================
   TODAY APPOINTMENTS
================================ */
export const getTodayAppointments = async (req, res) => {
  try {
    const start = new Date().setHours(0, 0, 0, 0);
    const end = new Date().setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      date: { $gte: start, $lte: end }
    }).sort({ time: 1 }).lean();

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching today's appointments",
      error: error.message
    });
  }
};

/* ================================
   TOP SERVICES
================================ */
export const getTopServices = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);

    const data = await Appointment.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'cancelled' } } },
      { $group: { _id: '$serviceName', bookings: { $sum: 1 }, revenue: { $sum: '$servicePrice' } } },
      { $sort: { bookings: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top services',
      error: error.message
    });
  }
};

/* ================================
   WEEKLY & MONTHLY REVENUE
================================ */
export const getWeeklyRevenue = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);

    const data = await Appointment.aggregate([
      { $match: { status: 'completed', date: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, revenue: { $sum: '$servicePrice' } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly revenue',
      error: error.message
    });
  }
};

export const getMonthlyRevenue = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const data = await Appointment.aggregate([
      { $match: { status: 'completed', date: { $gte: new Date(`${year}-01-01`) } } },
      { $group: { _id: { $month: '$date' }, revenue: { $sum: '$servicePrice' } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly revenue',
      error: error.message
    });
  }
};

/* ================================
   TOP CUSTOMERS & APPOINTMENT STATS
================================ */
export const getTopCustomers = async (req, res) => {
  try {
    const data = await Appointment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$customerEmail', name: { $first: '$customerName' }, totalSpent: { $sum: '$servicePrice' } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top customers',
      error: error.message
    });
  }
};

export const getAppointmentStats = async (req, res) => {
  try {
    const data = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment statistics',
      error: error.message
    });
  }
};

/* ================================
   DASHBOARD OVERVIEW
================================ */
export const getDashboardOverview = async (req, res) => {
  try {
    const [
      stats,
      recent,
      today,
      services,
      weekly,
      customers,
      appointmentStats
    ] = await Promise.all([
      Appointment.countDocuments(),
      getRecentActivity(req, { json: () => {} }),
      Appointment.find({}),
      getTopServices(req, { json: () => {} }),
      getWeeklyRevenue(req, { json: () => {} }),
      getTopCustomers(req, { json: () => {} }),
      getAppointmentStats(req, { json: () => {} })
    ]);

    res.status(200).json({
      success: true,
      data: { stats, recent, today, services, weekly, customers, appointmentStats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard overview',
      error: error.message
    });
  }
};
