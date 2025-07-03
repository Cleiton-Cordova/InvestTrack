// components/PortfolioChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#000000', '#EF4444', '#FACC15'];

const currencyLabel = (currency) => {
  switch (currency) {
    case 'USD': return 'Dollar';
    case 'EUR': return 'Euro';
    case 'BRL': return 'Real';
    default: return currency;
  }
};

const PortfolioChart = ({ assets }) => {
  const totalsByCurrency = assets.reduce((acc, asset) => {
    const total = asset.quantity * asset.price;
    if (acc[asset.currency]) {
      acc[asset.currency] += total;
    } else {
      acc[asset.currency] = total;
    }
    return acc;
  }, {});

  const chartData = Object.entries(totalsByCurrency).map(([currency, value]) => ({
    name: currencyLabel(currency),
    value: parseFloat(value.toFixed(2))
  }));

  const renderLabel = ({ name, percent, midAngle, cx, cy, outerRadius }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md mt-6">
      <h2 className="text-lg font-semibold text-white mb-4 text-center">Portfolio by Currency</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#000"
            dataKey="value"
            label={renderLabel}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: 'none', color: '#000' }}
            itemStyle={{ color: '#000' }}
            formatter={(value, name) => [`${value}`, `${name}`]}
          />
          <Legend
            wrapperStyle={{ color: '#fff' }}
            formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioChart;
