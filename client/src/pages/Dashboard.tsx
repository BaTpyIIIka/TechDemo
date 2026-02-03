import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { DashboardOverview, FunnelData } from '../types';

const Dashboard: React.FC = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [funnel, setFunnel] = useState<FunnelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, funnelRes] = await Promise.all([
        apiClient.get('/dashboard/overview'),
        apiClient.get('/dashboard/funnel')
      ]);
      setOverview(overviewRes.data);
      setFunnel(funnelRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Дашборд</h1>

      {overview && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div className="card">
            <h3>Всего Opportunities</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{overview.total_opportunities}</p>
          </div>
          <div className="card">
            <h3>Открыто</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>{overview.open_opportunities}</p>
          </div>
          <div className="card">
            <h3>Выиграно</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>{overview.won_opportunities}</p>
          </div>
          <div className="card">
            <h3>Проиграно</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>{overview.lost_opportunities}</p>
          </div>
          <div className="card">
            <h3>Сумма выигранных</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>${overview.total_value_won.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Воронка продаж</h2>
        <table>
          <thead>
            <tr>
              <th>Стадия</th>
              <th>Количество</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {funnel.map(item => (
              <tr key={item.stage}>
                <td>{item.stage}</td>
                <td>{item.count}</td>
                <td>${parseFloat(item.total_amount.toString()).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
