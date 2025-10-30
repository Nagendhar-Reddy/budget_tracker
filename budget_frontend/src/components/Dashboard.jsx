import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

function Dashboard({ apiUrl }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    fetchDashboard();
  }, [month, year]);

  useEffect(() => {
    if (summary) {
      drawPieChart();
      drawBarChart();
    }
  }, [summary]);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${apiUrl}/dashboard/`, {
        params: { month, year }
      });
      setSummary(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setLoading(false);
    }
  };

  const drawPieChart = () => {
    if (!summary || !summary.category_expenses || summary.category_expenses.length === 0) return;

    d3.select(pieChartRef.current).selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(pieChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .range(['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']);

    const pie = d3.pie()
      .value(d => d.total)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = svg.selectAll('arc')
      .data(pie(summary.category_expenses))
      .enter()
      .append('g');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i))
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', 'white')
      .text(d => d.data.category__name);
  };

  const drawBarChart = () => {
    if (!summary) return;

    d3.select(barChartRef.current).selectAll("*").remove();

    const data = [
      { label: 'Income', value: summary.total_income, color: '#4CAF50' },
      { label: 'Expense', value: summary.total_expense, color: '#f44336' },
      { label: 'Budget', value: summary.budget, color: '#2196F3' }
    ];

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };

    const svg = d3.select(barChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('font-size', '12px');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('font-size', '12px');

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin.bottom - y(d.value))
      .attr('fill', d => d.color);

    svg.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => `₹${d.value.toFixed(2)}`);
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2000, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {[2023, 2024, 2025].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #4CAF50' }}>
          <div className="stat-label">Total Income</div>
          <div className="stat-value" style={{ color: '#4CAF50' }}>
            ₹{summary?.total_income?.toFixed(2) || 0}
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #f44336' }}>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value" style={{ color: '#f44336' }}>
            ₹{summary?.total_expense?.toFixed(2) || 0}
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #2196F3' }}>
          <div className="stat-label">Balance</div>
          <div className="stat-value" style={{ color: summary?.balance >= 0 ? '#4CAF50' : '#f44336' }}>
            ₹{summary?.balance?.toFixed(2) || 0}
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #FF9800' }}>
          <div className="stat-label">Budget Remaining</div>
          <div className="stat-value" style={{ color: summary?.budget_remaining >= 0 ? '#4CAF50' : '#f44336' }}>
            ₹{summary?.budget_remaining?.toFixed(2) || 0}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Expense by Category</h3>
          <div ref={pieChartRef} style={{ display: 'flex', justifyContent: 'center' }}></div>
          {(!summary?.category_expenses || summary.category_expenses.length === 0) && (
            <p style={{ textAlign: 'center', color: '#666' }}>No expense data available</p>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Financial Overview</h3>
          <div ref={barChartRef} style={{ display: 'flex', justifyContent: 'center' }}></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;