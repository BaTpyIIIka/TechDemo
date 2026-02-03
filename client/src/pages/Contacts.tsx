import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Contact, Company } from '../types';

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '', position: '', company_id: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchContacts();
    fetchCompanies();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await apiClient.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await apiClient.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...formData, company_id: formData.company_id ? parseInt(formData.company_id) : undefined };
      if (editingId) {
        await apiClient.put(`/contacts/${editingId}`, data);
      } else {
        await apiClient.post('/contacts', data);
      }
      setShowModal(false);
      setFormData({ first_name: '', last_name: '', email: '', phone: '', position: '', company_id: '' });
      setEditingId(null);
      fetchContacts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Контакты</h1>
        <button onClick={() => { setShowModal(true); setEditingId(null); setFormData({ first_name: '', last_name: '', email: '', phone: '', position: '', company_id: '' }); }} className="btn btn-primary">
          Добавить контакт
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Должность</th>
            <th>Компания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id}>
              <td>{contact.first_name} {contact.last_name}</td>
              <td>{contact.email || '-'}</td>
              <td>{contact.phone || '-'}</td>
              <td>{contact.position || '-'}</td>
              <td>{contact.company_name || '-'}</td>
              <td>
                <button onClick={() => { setFormData({ first_name: contact.first_name, last_name: contact.last_name, email: contact.email || '', phone: contact.phone || '', position: contact.position || '', company_id: contact.company_id?.toString() || '' }); setEditingId(contact.id); setShowModal(true); }} className="btn btn-secondary" style={{ marginRight: '5px' }}>Изменить</button>
                <button onClick={async () => { if (window.confirm('Удалить?')) { await apiClient.delete(`/contacts/${contact.id}`); fetchContacts(); } }} className="btn btn-danger">Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Редактировать контакт' : 'Новый контакт'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Имя *</label>
                <input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Фамилия *</label>
                <input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Должность</label>
                <input value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Компания</label>
                <select value={formData.company_id} onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}>
                  <option value="">Не выбрано</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
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

export default Contacts;
