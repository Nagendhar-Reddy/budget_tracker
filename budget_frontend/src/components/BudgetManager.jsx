import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

function BudgetManager({ apiUrl }) {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: ''
  });
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const chartRef = useRef(null);

  useEffect(() => {
    fetchBudgets();
    fetchDashboard();
  }, [formData.month, formData.year]);

  useEffect(() => {
    if (summary) {
      drawBudgetChart();
    }
  }, [summary]);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(`${apiUrl}/budgets/`);
      setBudgets(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${apiUrl}/dashboard/`, {
        params: { month: formData.month, year: formData.year }
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const existingBudget = budgets.find(
        b => b.month === parseInt(formData.month) && b.year === parseInt(formData.year)
      );

      if (existingBudget) {
        await axios.put(`${apiUrl}/budgets/${existingBudget.id}/`, formData);
        setSuccess('Budget updated successfully!');
      } else {
        await axios.post(`${apiUrl}/budgets/`, formData);
        setSuccess('Budget created successfully!');
      }

      fetchBudgets();
      fetchDashboard();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error saving budget');
    }
  };

  const drawBudgetChart = () => {
    if (!summary) return;

    d3.select(chartRef.current).selectAll("*").remove();

    const data = [
      { label: 'Budget', value: summary.budget, color: '#2196F3' },
      { label: 'Spent', value: summary.total_expense, color: '#f44336' },
      { label: 'Remaining', value: Math.max(0, summary.budget - summary.total_expense), color: '#4CAF50' }
    ];

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // X-axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('font-size', '14px')
      .attr('font-weight', '500');

    // Y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .attr('font-size', '12px');

    // Bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin.bottom - y(d.value))
      .attr('fill', d => d.color)
      .attr('rx', 4);

    // Value labels
    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 8)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(d => `₹${d.value.toFixed(2)}`);
  };

  const currentBudget = budgets.find(
    b => b.month === parseInt(formData.month) && b.year === parseInt(formData.year)
  );

  return (
    <div>
      <div className="card">
        <h3>Set Monthly Budget</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '15px', alignItems: 'end' }}>
            <div className="form-group">
              <label>Month</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                required
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
              >
                {[2023, 2024, 2025].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Budget Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter budget amount"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              {currentBudget ? 'Update' : 'Set'} Budget
            </button>
          </div>
        </form>

        {error && <div className="error" style={{ marginTop: '10px' }}>{error}</div>}
        {success && <div className="success" style={{ marginTop: '10px' }}>{success}</div>}
      </div>

      {summary && summary.budget > 0 && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Budget Overview - {new Date(formData.year, formData.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
          
          <div className="stats-grid" style={{ marginTop: '20px', marginBottom: '30px' }}>
            <div className="stat-card" style={{ borderLeft: '4px solid #2196F3' }}>
              <div className="stat-label">Budget Set</div>
              <div className="stat-value" style={{ color: '#2196F3' }}>
                ₹{summary.budget?.toFixed(2)}
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #f44336' }}>
              <div className="stat-label">Amount Spent</div>
              <div className="stat-value" style={{ color: '#f44336' }}>
                ₹{summary.total_expense?.toFixed(2)}
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #4CAF50' }}>
              <div className="stat-label">Remaining</div>
              <div className="stat-value" style={{ color: summary.budget_remaining >= 0 ? '#4CAF50' : '#f44336' }}>
                ₹{summary.budget_remaining?.toFixed(2)}
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #FF9800' }}>
              <div className="stat-label">Usage</div>
              <div className="stat-value" style={{ color: '#FF9800' }}>
                {summary.budget > 0 ? ((summary.total_expense / summary.budget) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>

          {summary.budget_remaining < 0 && (
            <div style={{ 
              background: '#ffebee', 
              color: '#c62828', 
              padding: '15px', 
              borderRadius: '5px',
              marginBottom: '20px',
              fontWeight: '500'
            }}>
              ⚠️ Warning: You have exceeded your budget by ₹{Math.abs(summary.budget_remaining).toFixed(2)}
            </div>
          )}

          <div ref={chartRef} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}></div>
        </div>
      )}

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Budget History</h3>
        {budgets.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No budgets set yet. Create your first budget above!
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Year</th>
                <th>Budget Amount</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map(budget => (
                <tr key={budget.id}>
                  <td>{new Date(2000, budget.month - 1).toLocaleString('default', { month: 'long' })}</td>
                  <td>{budget.year}</td>
                  <td style={{ fontWeight: 'bold', color: '#2196F3' }}>
                    ₹{parseFloat(budget.amount).toFixed(2)}
                  </td>
                  <td>{new Date(budget.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BudgetManager;