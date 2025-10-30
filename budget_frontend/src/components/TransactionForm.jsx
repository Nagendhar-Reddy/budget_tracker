import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TransactionForm({ apiUrl, editTransaction, onSuccess, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
    if (editTransaction) {
      setFormData({
        type: editTransaction.type,
        category: editTransaction.category,
        amount: editTransaction.amount,
        description: editTransaction.description,
        date: editTransaction.date
      });
    }
  }, [editTransaction]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/categories/`);
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    try {
      await axios.post(`${apiUrl}/categories/`, {
        name: newCategory,
        type: formData.type
      });
      setNewCategory('');
      setShowNewCategory(false);
      fetchCategories();
      setSuccess('Category added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error adding category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editTransaction) {
        await axios.put(`${apiUrl}/transactions/${editTransaction.id}/`, formData);
        setSuccess('Transaction updated successfully!');
      } else {
        await axios.post(`${apiUrl}/transactions/`, formData);
        setSuccess('Transaction added successfully!');
        setFormData({
          type: 'expense',
          category: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      setTimeout(() => {
        setSuccess('');
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Error saving transaction');
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="card">
      <h3>{editTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              style={{ flex: 1 }}
            >
              <option value="">Select Category</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button 
              type="button" 
              onClick={() => setShowNewCategory(!showNewCategory)}
              className="btn btn-secondary"
            >
              +
            </button>
          </div>
        </div>

        {showNewCategory && (
          <div className="form-group">
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
              />
              <button type="button" onClick={handleAddCategory} className="btn btn-primary">
                Add
              </button>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add notes..."
            rows="3"
          />
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary">
            {editTransaction ? 'Update' : 'Add'} Transaction
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TransactionForm; 