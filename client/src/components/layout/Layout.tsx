import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav style={{ backgroundColor: '#343a40', color: 'white', padding: '15px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>CRM</h2>
            <Link to="/opportunities" style={{ color: 'white', textDecoration: 'none' }}>Opportunities</Link>
            <Link to="/companies" style={{ color: 'white', textDecoration: 'none' }}>Компании</Link>
            <Link to="/contacts" style={{ color: 'white', textDecoration: 'none' }}>Контакты</Link>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Дашборд</Link>
            <Link to="/import" style={{ color: 'white', textDecoration: 'none' }}>Импорт</Link>
            {user?.role === 'admin' && (
              <Link to="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>Пользователи</Link>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>{user?.email}</span>
            <button onClick={logout} className="btn btn-secondary">Выйти</button>
          </div>
        </div>
      </nav>
      <div className="container" style={{ paddingTop: '30px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
