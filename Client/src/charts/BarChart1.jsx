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

const BarChart1 = () => {
  const topProducts = [
    { name: 'Furniture', sales: 500 },
    { name: 'Cosmetic', sales: 420 },
    { name: 'Others', sales: 310 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={topProducts}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 13 }} // X-axis font size
        />
        <YAxis
          tick={{ fontSize: 13 }} // Y-axis font size
        />
        <Tooltip
          contentStyle={{ fontSize: '13px' }} // Tooltip container
          itemStyle={{ fontSize: '13px' }} // Tooltip content
          labelStyle={{ fontSize: '13px' }} // Tooltip label
        />
        <Bar dataKey="sales" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarChart1
