import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminRoute from "./admin/AdminRoute";
import Dashboard from "./admin/Dashboard";
import AppointmentsPage from "./admin/pages/AppointmentsPage";
import ContactsPage from "./admin/pages/ContactsPage";
import Services from "./admin/pages/Services";
import Team from "./admin/pages/Team";
import Testimonials from "./admin/pages/Testmonial";
import Gallery from "./admin/pages/Gallery";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="services" element={<Services />} />
          <Route path="team" element={<Team />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 