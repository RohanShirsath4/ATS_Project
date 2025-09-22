import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Dashboard from './pages/Dashboard';
import './App.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

     
function App() {
  return (   
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              {/* <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              /> */}
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute adminOnly={true}>
                    <AdminDashboard/>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/attendance" 
                element={
                  <PrivateRoute>
                    <Attendance />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/leave" 
                element={
                  <PrivateRoute>
                    <Leave />
                  </PrivateRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      <Footer/>
      </Router>
    </AuthProvider>
  );
}

export default App;