import React, { useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, Star } from 'lucide-react';

export default function Team() {
  const [teamMembers] = useState([
    { id: 1, name: 'John Barber', role: 'Master Barber', email: 'john@salon.com', phone: '+1 (555) 123-4567', rating: 4.9, image: null },
    { id: 2, name: 'Sarah Stylist', role: 'Hair Stylist', email: 'sarah@salon.com', phone: '+1 (555) 987-6543', rating: 4.8, image: null },
    { id: 3, name: 'Mike Trimmer', role: 'Beard Specialist', email: 'mike@salon.com', phone: '+1 (555) 456-7890', rating: 4.7, image: null },
    { id: 4, name: 'Emma Colorist', role: 'Color Expert', email: 'emma@salon.com', phone: '+1 (555) 321-0987', rating: 4.9, image: null },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">Manage your salon staff and specialists</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
          <Plus size={20} />
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white text-3xl font-bold mb-4">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-amber-600 font-medium mb-2">{member.role}</p>
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(member.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">{member.rating}</span>
              </div>

              <div className="space-y-2 w-full">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <span className="text-sm truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  <span className="text-sm">{member.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100 w-full justify-center">
                <button className="flex-1 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit size={18} />
                </button>
                <button className="flex-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}