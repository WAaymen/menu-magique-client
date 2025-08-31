import React, { createContext, useContext, useState, useEffect } from 'react';

interface Cashier {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

interface AuthContextType {
  cashier: Cashier | null;
  isAuthenticated: boolean;
  login: (name: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [cashier, setCashier] = useState<Cashier | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedCashier = localStorage.getItem('cashier');
    if (savedCashier) {
      try {
        setCashier(JSON.parse(savedCashier));
      } catch (error) {
        console.error('Error parsing saved cashier data:', error);
        localStorage.removeItem('cashier');
      }
    }
    setLoading(false);
  }, []);

  const login = async (name: string, password: string): Promise<boolean> => {
    try {
      // Make API call to Laravel backend to verify cashier credentials
      const response = await fetch('http://localhost:8000/api/cashiers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const cashierData: Cashier = {
          id: data.id,
          name: data.name,
          status: data.status,
        };
        
        setCashier(cashierData);
        localStorage.setItem('cashier', JSON.stringify(cashierData));
        
        // Redirect to admin dashboard after successful login
        window.location.href = 'http://localhost:8080';
        return true;
      } else {
        // If API fails, fallback to mock validation for development
        console.warn('API login failed, using mock validation');
        
        // Mock validation - you can remove this in production
        if (name.toLowerCase() === 'admin' && password === 'admin123') {
          const mockCashier: Cashier = {
            id: 1,
            name: 'Admin',
            status: 'active',
          };
          setCashier(mockCashier);
          localStorage.setItem('cashier', JSON.stringify(mockCashier));
          
          // Redirect to admin dashboard after successful login
          window.location.href = 'http://localhost:8080';
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to mock validation if network error
      if (name.toLowerCase() === 'admin' && password === 'admin123') {
        const mockCashier: Cashier = {
          id: 1,
          name: 'Admin',
          status: 'active',
        };
        setCashier(mockCashier);
        localStorage.setItem('cashier', JSON.stringify(mockCashier));
        
        // Redirect to admin dashboard after successful login
        window.location.href = 'http://localhost:8080';
        return true;
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      // Get current cashier data
      const cashierData = localStorage.getItem('cashier');
      if (cashierData) {
        const cashier = JSON.parse(cashierData);
        
        // Call server logout endpoint
        await fetch('http://localhost:8000/api/cashiers/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cashier_id: cashier.id }),
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setCashier(null);
      localStorage.removeItem('cashier');
    }
  };

  const value: AuthContextType = {
    cashier,
    isAuthenticated: !!cashier,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
