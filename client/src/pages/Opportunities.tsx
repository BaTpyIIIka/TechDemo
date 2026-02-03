import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Opportunity } from '../types';

const stageLabels: Record<string, string> = {
  screening: 'Скрининг',
  deep_dive: 'Дипдайв',
  due_diligence: 'Дью Дилидженс',
  signing: 'Сайнинг',
  closed: 'Закрыто'
};

const Opportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await apiClient.get('/opportunities');
      setOpportunities(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Opportunities</h1>
        <button className="btn btn-primary">Добавить Opportunity</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Компания</th>
            <th>Стадия</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Дата закрытия</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map(opp => (
            <tr key={opp.id}>
              <td>{opp.name}</td>
              <td>{opp.company_name || '-'}</td>
              <td>{stageLabels[opp.stage]}</td>
              <td>{opp.amount ? `$${opp.amount.toLocaleString()}` : '-'}</td>
              <td>{opp.status}</td>
              <td>{opp.expected_close_date ? new Date(opp.expected_close_date).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Opportunities;
