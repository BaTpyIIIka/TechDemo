import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { User } from '../../types';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'user', first_name: '', last_name: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/users', formData);
      setShowModal(false);
      setFormData({ email: '', password: '', role: 'user', first_name: '', last_name: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить пользователя?')) return;
    try {
      await apiClient.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Пользователи</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">Добавить пользователя</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Имя</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDelete(user.id)} className="btn btn-danger">Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Новый пользователь</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Пароль *</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Имя</label>
                <input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Фамилия</label>
                <input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Роль</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
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

export default Users;
