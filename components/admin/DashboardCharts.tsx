'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useTranslations } from 'next-intl';

const growthData = [
  { month: 'Apr', users: 2100 },
  { month: 'May', users: 2800 },
  { month: 'Jun', users: 3600 },
  { month: 'Jul', users: 4500 },
  { month: 'Aug', users: 5400 },
  { month: 'Sep', users: 6200 },
  { month: 'Oct', users: 7000 },
  { month: 'Nov', users: 7800 },
  { month: 'Dec', users: 8300 },
  { month: 'Jan', users: 8700 },
  { month: 'Feb', users: 9200 },
  { month: 'Mar', users: 9840 },
];

const careData = [
  { week: 'W1', given: 42, received: 38 },
  { week: 'W2', given: 55, received: 50 },
  { week: 'W3', given: 48, received: 45 },
  { week: 'W4', given: 63, received: 58 },
  { week: 'W5', given: 71, received: 66 },
  { week: 'W6', given: 59, received: 54 },
  { week: 'W7', given: 78, received: 72 },
  { week: 'W8', given: 84, received: 79 },
];

export default function DashboardCharts() {
  const t = useTranslations('admin.dashboard');
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Platform Growth */}
      <div className="bg-white rounded-xl border border-outline/20 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-on-surface mb-1">{t('platformGrowth')}</h3>
        <p className="text-xs text-on-surface/60 mb-4">{t('growthCaption')}</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={growthData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8c4a60" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8c4a60" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#83737720" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #83737730' }}
              formatter={(val) => [
                typeof val === 'number'
                  ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  : val,
                t('users'),
              ]}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#8c4a60"
              strokeWidth={2}
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Care Given vs Received */}
      <div className="bg-white rounded-xl border border-outline/20 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-on-surface mb-1">{t('careActivity')}</h3>
        <p className="text-xs text-on-surface/60 mb-4">{t('careCaption')}</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={careData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#83737720" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #83737730' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="given" name={t('careGiven')} fill="#8c4a60" radius={[6, 6, 0, 0]} />
            <Bar dataKey="received" name={t('careReceived')} fill="#74565f" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
