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
import { useAdminDashboardQuery } from '@/lib/queries/admin/dashboard';

export default function DashboardCharts() {
  const t = useTranslations('admin.dashboard');
  const dashboardQuery = useAdminDashboardQuery();
  const growthData = dashboardQuery.data?.charts.growth ?? [];
  const careData = dashboardQuery.data?.charts.careActivity ?? [];
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
        {dashboardQuery.isError ? (
          <p className="mt-3 text-xs text-on-surface/60">Failed to load chart data.</p>
        ) : null}
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
        {dashboardQuery.isError ? (
          <p className="mt-3 text-xs text-on-surface/60">Failed to load chart data.</p>
        ) : null}
      </div>
    </div>
  );
}
