import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AppointmentsChartWidget = ({ chartData }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Weekly Appointments & Revenue</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={3} name="Appointments" />
          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenue (₹)" yAxisId="right" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="day" />
          <YAxis />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip 
            formatter={(value, name) => [
              name === 'Revenue (₹)' ? `₹${value.toLocaleString()}` : value,
              name
            ]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AppointmentsChartWidget;
