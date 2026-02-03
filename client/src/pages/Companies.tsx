import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Company } from '../types';

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', industry: '', website: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await apiClient.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/companies/${editingId}`, formData);
      } else {
        await apiClient.post('/companies', formData);
      }
      setShowModal(false);
      setFormData({ name: '', description: '', industry: '', website: '' });
      setEditingId(null);
      fetchCompanies();
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить компанию?')) return;
    try {
      await apiClient.delete(`/companies/${id}`);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const handleEdit = (company: Company) => {
    setFormData({
      name: company.name,
      description: company.description || '',
      industry: company.industry || '',
      website: company.website || '',
    });
    setEditingId(company.id);
    setShowModal(true);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Компании</h1>
        <button onClick={() => { setShowModal(true); setEditingId(null); setFormData({ name: '', description: '', industry: '', website: '' }); }} className="btn btn-primary">
          Добавить компанию
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Отрасль</th>
            <th>Веб-сайт</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.industry || '-'}</td>
              <td>{company.website || '-'}</td>
              <td>
                <button onClick={() => handleEdit(company)} className="btn btn-secondary" style={{ marginRight: '5px' }}>Изменить</button>
                <button onClick={() => handleDelete(company.id)} className="btn btn-danger">Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Редактировать компанию' : 'Новая компания'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название *</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="form-group">
                <label>Отрасль</label>
                <input value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Веб-сайт</label>
                <input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">Сохранить</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
