import React, { useState } from 'react';
import apiClient from '../api/client';

const Import: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [entityType, setEntityType] = useState('company');
  const [result, setResult] = useState<any>(null);

  const handleImport = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('entity_type', entityType);
    formData.append('column_mapping', JSON.stringify({}));

    try {
      const response = await apiClient.post('/import/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (error: any) {
      console.error('Error:', error);
      alert('Ошибка импорта: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div>
      <h1>Импорт данных</h1>

      <div className="card">
        <div className="form-group">
          <label>Тип данных</label>
          <select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
            <option value="company">Компании</option>
            <option value="contact">Контакты</option>
            <option value="opportunity">Opportunities</option>
          </select>
        </div>

        <div className="form-group">
          <label>Файл (CSV или Excel)</label>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        <button onClick={handleImport} disabled={!file} className="btn btn-primary">
          Импортировать
        </button>

        {result && (
          <div style={{ marginTop: '20px' }}>
            <p className="success">Успешно импортировано: {result.success}</p>
            {result.failed > 0 && <p className="error">Ошибок: {result.failed}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Import;
