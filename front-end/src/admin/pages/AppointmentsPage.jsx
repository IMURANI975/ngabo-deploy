import React, { useEffect, useState } from 'react';
import { getAppointments } from '../../api/appointments';

export default function AppointmentsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to check if appointment date is in the past
  const isAppointmentCompleted = (appointmentDate, appointmentTime) => {
    if (!appointmentDate) return false;
    
    // Combine date and time into a single datetime
    const appointmentDateTime = new Date(appointmentDate);
    
    // If there's a time, parse it and add to the date
    if (appointmentTime) {
      const [hours, minutes] = appointmentTime.split(':').map(Number);
      appointmentDateTime.setHours(hours || 0, minutes || 0, 0, 0);
    }
    
    const now = new Date();
    
    // Compare appointment datetime with current datetime
    return appointmentDateTime < now;
  };

  // Function to get status badge styling
  const getStatusBadgeStyle = (status, isCompleted) => {
    if (isCompleted) {
      return "px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200";
    }
    
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return "px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200";
      case 'pending':
        return "px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200";
      case 'cancelled':
        return "px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  // Function to get display status text
  const getDisplayStatus = (status, isCompleted) => {
    return isCompleted ? 'Completed' : (status || 'Pending');
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    getAppointments()
      .then((data) => setItems(data || []))
      .catch((err) =>
        setError(err?.response?.data?.error || 'Failed to load appointments')
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Phone</th>
                <th className="py-3 pr-4">Service</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Time</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => {
                // Check if appointment is completed
                const isCompleted = isAppointmentCompleted(a.date, a.time);
                
                return (
                  <tr key={a._id} className="border-b text-sm">
                    <td className="py-3 pr-4 font-medium text-gray-900">{a.name}</td>
                    <td className="py-3 pr-4">{a.email}</td>
                    <td className="py-3 pr-4">{a.phone}</td>
                    <td className="py-3 pr-4">{a.service}</td>
                    <td className="py-3 pr-4">
                      {a.date ? new Date(a.date).toLocaleDateString() : ''}
                    </td>
                    <td className="py-3 pr-4">{a.time}</td>
                    <td className="py-3 pr-4">
                      <span className={getStatusBadgeStyle(a.status, isCompleted)}>
                        {getDisplayStatus(a.status, isCompleted)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td className="py-6 text-gray-600" colSpan={7}>
                    No appointments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}