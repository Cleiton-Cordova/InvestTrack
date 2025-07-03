// components/AssetBarChart.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

const AssetBarChart = ({ assets }) => {
  const chartData = assets.map((asset) => ({
    name: asset.ticker,
    value: parseFloat((asset.quantity * asset.price).toFixed(2)),
  }));

  const barColors = ['#000000', '#D50000', '#FFD700']; // Black, Red, Yellow

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md mt-6">
      <h2 className="text-lg font-semibold text-white mb-4 text-center">
        Total Invested per Asset
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
          <XAxis dataKey="name" stroke="#E5E7EB" />
          <YAxis stroke="#E5E7EB" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: 'none', color: '#000' }}
            itemStyle={{ color: '#000' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetBarChart;
