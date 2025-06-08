import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const PieChart1 = () => {
  const paymentMethods = [
    { name: 'Credit Card', value: 400 },
    { name: 'PayPal', value: 300 },
    { name: 'Cash on Delivery', value: 100 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

  // Custom label renderer to show value outside the pie
  const renderCustomValueLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    index,
    value
  }) => {
    const RADIAN = Math.PI / 180
    const labelRadius = outerRadius + 20 // Position outside the pie
    const x = cx + labelRadius * Math.cos(-midAngle * RADIAN)
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        fontSize={13}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {value}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={paymentMethods}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={renderCustomValueLabel}
        >
          {paymentMethods.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default PieChart1
