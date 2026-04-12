'use client'

import React from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineProps {
  data: any[]
  color?: string
}

export function Sparkline({ data, color = "#7C3AED" }: SparklineProps) {
  return (
    <div className="w-20 h-10 select-none opacity-60 group-hover:opacity-100 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="v" 
            stroke={color} 
            strokeWidth={3} 
            dot={false} 
            animationDuration={3000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
