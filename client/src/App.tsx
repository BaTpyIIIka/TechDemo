import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Opportunities from './pages/Opportunities';
import Companies from './pages/Companies';
import Contacts from './pages/Contacts';
import Dashboard from './pages/Dashboard';
import Import from './pages/Import';
import Users from './pages/Admin/Users';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/opportunities" />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="companies" element={<Companies />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="import" element={<Import />} />
          <Route
            path="admin/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
