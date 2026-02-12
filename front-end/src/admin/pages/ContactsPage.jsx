import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';

export default function ContactsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/api/contacts')
      .then(({ data }) => setItems(data?.data || []))
      .catch((err) => setError(err?.response?.data?.error || 'Failed to load contacts'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Contacts</h2>

      {error && (
        <div className="mb-4 p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="space-y-4">
          {items.map((c) => (
            <div key={c._id} className="border border-gray-200 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-900">{c.name}</p>
                  <p className="text-sm text-gray-600">
                    {c.email} {c.phone ? `• ${c.phone}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-sm">
                    {c.subject}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-sm">
                    {c.status}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-gray-800 whitespace-pre-wrap">{c.message}</p>
              <p className="mt-3 text-xs text-gray-500">
                Preferred: {c.preferredContact} •{' '}
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
              </p>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-600">No contact messages yet.</p>}
        </div>
      )}
    </div>
  );
}

