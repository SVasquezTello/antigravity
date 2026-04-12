'use client'

import React from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'

interface DashboardChartProps {
  data: any[]
  color?: string
}

export function DashboardChart({ data, color = "#7C3AED" }: DashboardChartProps) {
  return (
    <div className="w-full h-80 glass-card p-6 border-white/5 bg-white/[0.02]">
      <div className="flex flex-col mb-6">
        <h4 className="text-xl font-black text-white tracking-tight">Portal Usage Activity</h4>
        <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">Last 7 Days Insight</p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(5,0,20,0.8)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              fontSize: '12px',
              color: '#fff'
            }}
            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
            cursor={{ stroke: 'rgba(124,58,237,0.4)', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorUsage)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
