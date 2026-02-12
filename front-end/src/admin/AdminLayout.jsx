import React,{useState,useEffect} from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getAppointments } from '../api/appointments';
import { api } from "../api/api"
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  Users2, 
  Star, 
  Image, 
  LogOut,
  Home,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group ${
    isActive 
      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200' 
      : 'text-gray-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-700 hover:shadow-md'
  }`;

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

    const [itemss, setItemss] = useState([]);
     const [error, setError] = useState('');
   
    useEffect(() => {
      
      setError('');
      api
        .get('/api/contacts')
        .then(({ data }) => setItemss(data?.data || []))
        .catch((err) => setError(err?.response?.data?.error || 'Failed to load contacts'))
        
    }, []);


   const [items, setItems] = useState([]);
  
   
  
    useEffect(() => {
     
      setError('');
      getAppointments()
        .then((data) => setItems(data || []))
        .catch((err) =>
          setError(err?.response?.data?.error || 'Failed to load appointments')
        )
        
    }, []);
  

  const navItems = [
    { to: '/admin', end: true, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/appointments', icon: <Calendar size={20} />, label: 'Appointments' },
    { to: '/admin/contacts', icon: <Users size={20} />, label: 'Contacts' },
    { to: '/admin/services', icon: <Scissors size={20} />, label: 'Services' },
    // { to: '/admin/team', icon: <Users2 size={20} />, label: 'Team' },
    { to: '/admin/testimonials', icon: <Star size={20} />, label: 'Testimonials' },
    { to: '/admin/gallery', icon: <Image size={20} />, label: 'Gallery' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                <Scissors className="text-white" size={24} />
              </div>
              <div>
                <Link to="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Ngabo Saloon
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold">
                    Admin
                  </span>
                </Link>
                <p className="text-xs text-gray-500">Welcome back, Administrator</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              {/* <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div> */}

              {/* Notification Bell */}
              {/* <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button> */}

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sticky top-24">
              <div className="mb-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Admin</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={navLinkClass}
                  >
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    <ChevronRight 
                      size={16} 
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-amber-500" 
                    />
                  </NavLink>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Today's Appointments</span>
                    <span className="text-sm font-bold text-amber-600">{items.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Pending Messages</span>
                    <span className="text-sm font-bold text-orange-500">{itemss.length}</span>
                  </div>
                </div>
              </div>

              {/* Back to Home */}
              <Link 
                to="/" 
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group"
              >
                <Home size={16} className="text-gray-500 group-hover:text-amber-600" />
                <span className="text-sm text-gray-600 group-hover:text-amber-700">Back to Home</span>
              </Link>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-4">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center text-sm text-gray-500">
              <Link to="/admin" className="hover:text-amber-600 transition-colors">Dashboard</Link>
              <ChevronRight size={16} className="mx-2" />
              <span className="text-gray-700 font-medium">Overview</span>
            </div>

            {/* Content Card */}
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl border border-amber-100 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 animate-gradient-x"></div>
              <div className="p-8">
                <Outlet />
              </div>
            </div>

            {/* Footer Stats */}
            {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-white to-amber-50 rounded-2xl p-4 border border-amber-100 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-xs text-gray-500">Total Appointments</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-4 border border-blue-100 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">42</p>
                    <p className="text-xs text-gray-500">Team Members</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-white to-green-50 rounded-2xl p-4 border border-green-100 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                    <p className="text-xs text-gray-500">Avg. Rating</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-white to-purple-50 rounded-2xl p-4 border border-purple-100 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Scissors className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">28</p>
                    <p className="text-xs text-gray-500">Services</p>
                  </div>
                </div>
              </div>
            </div> */}
          </main>
        </div>
      </div>

      {/* Bottom Bar */}
      <footer className="mt-12 border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>© 2024 Ngabo Saloon Admin. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <Link to="/privacy" className="hover:text-amber-600 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-amber-600 transition-colors">Terms of Service</Link>
              <Link to="/help" className="hover:text-amber-600 transition-colors">Help Center</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}