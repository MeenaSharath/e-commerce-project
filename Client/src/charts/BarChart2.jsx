import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

const BarChart2 = () => {
  const ordersByStatus = [
    { status: 'Pending', count: 120 },
    { status: 'Processing', count: 80 },
    { status: 'Shipped', count: 60 },
    { status: 'Delivered', count: 150 },
    { status: 'Cancelled', count: 30 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={ordersByStatus}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="status"
          tick={{ fontSize: 13 }} // X-axis label font size
        />
        <YAxis
          tick={{ fontSize: 13 }} // Y-axis label font size
        />
        <Tooltip
          contentStyle={{ fontSize: '13px' }} // Tooltip container
          itemStyle={{ fontSize: '13px' }} // Tooltip content
          labelStyle={{ fontSize: '13px' }} // Tooltip label
        />
        <Bar dataKey="count" fill="#ff8042" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarChart2
