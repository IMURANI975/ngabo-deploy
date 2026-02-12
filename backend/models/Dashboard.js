import mongoose from 'mongoose';

// Dashboard metrics schema (for storing historical data)
const dashboardMetricsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    newCustomers: {
      type: Number,
      default: 0
    },
    todayAppointments: {
      type: Number,
      default: 0
    },
    completedAppointments: {
      type: Number,
      default: 0
    },
    pendingMessages: {
      type: Number,
      default: 0
    },
    activeServices: {
      type: Number,
      default: 0
    },
    totalClients: {
      type: Number,
      default: 0
    },
    servicesBooked: {
      type: Map,
      of: Number,
      default: {}
    },
    peakHours: {
      type: [String],
      default: []
    },
    averageRating: {
      type: Number,
      default: 0
    },
    revenueByCategory: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Index for date queries
dashboardMetricsSchema.index({ date: 1 });

// Static method to get today's metrics or create if not exists
dashboardMetricsSchema.statics.getTodayMetrics = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let metrics = await this.findOne({ date: today });

  if (!metrics) {
    metrics = await this.create({
      date: today,
      totalRevenue: 0,
      newCustomers: 0,
      todayAppointments: 0,
      completedAppointments: 0,
      pendingMessages: 0,
      activeServices: 0,
      totalClients: 0
    });
  }

  return metrics;
};

const DashboardMetrics = mongoose.model(
  'DashboardMetrics',
  dashboardMetricsSchema
);

export default DashboardMetrics;
