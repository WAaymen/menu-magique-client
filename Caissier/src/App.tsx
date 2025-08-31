import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { MenuManagement } from "./pages/MenuManagement";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('currentUser');
    return savedAuth === 'true' && savedUser ? true : false;
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('currentUser') || '';
  });

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', currentUser);
      localStorage.setItem('loginTime', Date.now().toString());
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('loginTime');
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
        const sessionAge = Date.now() - parseInt(loginTime);
        const maxSessionAge = 8 * 60 * 60 * 1000;
        
        if (sessionAge > maxSessionAge) {
          handleLogout();
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (user: string) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
    setIsAuthenticated(false);
    setCurrentUser("");
    alert("تم تسجيل الخروج بنجاح");
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="/menu-management" element={<MenuManagement currentUser={currentUser} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
