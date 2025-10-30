import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from './TransactionForm';

function TransactionList({ apiUrl }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    start_date: '',
    end_date: '',
    min_amount: '',
    max_amount: '',
    type: ''
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/categories/`);
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = { 
        page: currentPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        )
      };
      
      const response = await axios.get(`${apiUrl}/transactions/`, { params });
      setTransactions(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await axios.delete(`${apiUrl}/transactions/${id}/`);
      fetchTransactions();
    } catch (error) {
      alert('Error deleting transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      start_date: '',
      end_date: '',
      min_amount: '',
      max_amount: '',
      type: ''
    });
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Filter Transactions</h3>
        <div className="filters">
          <div className="form-group">
            <label>Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Min Amount</label>
            <input
              type="number"
              value={filters.min_amount}
              onChange={(e) => setFilters({ ...filters, min_amount: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label>Max Amount</label>
            <input
              type="number"
              value={filters.max_amount}
              onChange={(e) => setFilters({ ...filters, max_amount: e.target.value })}
              placeholder="10000"
            />
          </div>
        </div>
        <button onClick={resetFilters} className="btn btn-secondary">
          Reset Filters
        </button>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>All Transactions</h3>
        
        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No transactions found. Add your first transaction above!
          </p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: transaction.type === 'income' ? '#e8f5e9' : '#ffebee',
                        color: transaction.type === 'income' ? '#2e7d32' : '#c62828'
                      }}>
                        {transaction.type}
                      </span>
                    </td>
                    <td>{transaction.category_name}</td>
                    <td style={{ 
                      fontWeight: 'bold',
                      color: transaction.type === 'income' ? '#4CAF50' : '#f44336'
                    }}>
                      ₹{parseFloat(transaction.amount).toFixed(2)}
                    </td>
                    <td>{transaction.description || '-'}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(transaction)}
                        className="btn btn-secondary"
                        style={{ marginRight: '5px', padding: '5px 10px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(transaction.id)}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <TransactionForm
              apiUrl={apiUrl}
              editTransaction={editingTransaction}
              onSuccess={handleEditSuccess}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionList;