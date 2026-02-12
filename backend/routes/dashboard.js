import express from 'express';
import {
  getDashboardOverview,
  getDashboardStats,
  getRecentActivity,
  getTodayAppointments,
  getTopServices,
  getMonthlyRevenue,
  getWeeklyRevenue,
  getTopCustomers,
  getAppointmentStats
} from '../controllers/dashboardController.js';

import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(requireAdmin);

router.route('/overview').get(getDashboardOverview);
router.route('/stats').get(getDashboardStats);
router.route('/recent-activity').get(getRecentActivity);
router.route('/today-appointments').get(getTodayAppointments);
router.route('/top-services').get(getTopServices);
router.route('/top-customers').get(getTopCustomers);
router.route('/appointment-stats').get(getAppointmentStats);
router.route('/revenue/monthly').get(getMonthlyRevenue);
router.route('/revenue/weekly').get(getWeeklyRevenue);

export default router;
