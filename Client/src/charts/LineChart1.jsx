import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

const LineChart1 = () => {
  const salesData = [
    { date: 'May 1', sales: 2400 },
    { date: 'May 2', sales: 2800 },
    { date: 'May 3', sales: 2100 },
    { date: 'May 4', sales: 3000 },
    { date: 'May 5', sales: 2600 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 13 }} // Smaller X-axis font
        />
        <YAxis
          tick={{ fontSize: 13 }} // Smaller Y-axis font
        />
        <Tooltip
          contentStyle={{ fontSize: '13px' }} // Tooltip font size
          itemStyle={{ fontSize: '13px' }} // Tooltip item font size
          labelStyle={{ fontSize: '13px' }} // Tooltip label font size
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LineChart1
