
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { User } from './types';
// Fix: Use namespace import for react-router-dom to handle environment resolution issues
import * as Router from 'react-router-dom';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({ id: session.user.id, email: session.user.email ?? '' });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({ id: session.user.id, email: session.user.email ?? '' });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Router.HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <Navigation user={user} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Router.Routes>
            <Router.Route path="/dashboard" element={<Dashboard user={user} />} />
            <Router.Route path="/add" element={<ExpenseForm user={user} />} />
            <Router.Route path="/history" element={<ExpenseList user={user} />} />
            <Router.Route path="*" element={<Router.Navigate to="/dashboard" replace />} />
          </Router.Routes>
        </main>
      </div>
    </Router.HashRouter>
  );
};

export default App;
