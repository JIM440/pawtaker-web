'use client';

import { useState } from 'react';

const TABS = ['All Requests', 'Open', 'Matched', 'Active', 'Completed', 'Cancelled'] as const;
type Tab = typeof TABS[number];

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('All Requests');

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Care Requests</h1>
          <p className="text-on-surface/70 text-sm mt-1">
            Review and manage community pet care matching.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline/30 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors">
            <span className="text-sm">☰</span>
            Filter
          </button>
        </div>
      </div>

      <div className="flex border-b border-outline/20 mb-6 overflow-x-auto whitespace-nowrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium transition-colors shrink-0 ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary font-bold'
                : 'text-on-surface/60 hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-surface-container border-b border-outline/10 text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">Pet &amp; Breed</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4 hidden sm:table-cell">Service Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Points</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {[
                { emoji: '🐶', name: 'Buddy', breed: 'Golden Retriever', owner: 'Sarah Johnson', tier: 'Premium Member', dates: 'Oct 12 - Oct 15', duration: '3 Nights', status: 'Open', statusColor: 'bg-blue-100 text-blue-800', points: '450 pts' },
                { emoji: '🐱', name: 'Luna', breed: 'Siamese', owner: 'Mike Ross', tier: 'Standard Member', dates: 'Oct 14 - Oct 14', duration: 'Day Care', status: 'Matched', statusColor: 'bg-amber-100 text-amber-800', points: '150 pts' },
                { emoji: '🐕', name: 'Max', breed: 'Beagle', owner: 'Emily Davis', tier: 'Premium Member', dates: 'Oct 10 - Oct 20', duration: '10 Nights', status: 'Active', statusColor: 'bg-emerald-100 text-emerald-800', points: '1200 pts' },
                { emoji: '🐰', name: 'Bella', breed: 'Rabbit', owner: 'Chris Pratt', tier: 'Standard Member', dates: 'Oct 01 - Oct 03', duration: '2 Nights', status: 'Completed', statusColor: 'bg-slate-100 text-slate-800', points: '300 pts' },
                { emoji: '🐩', name: 'Charlie', breed: 'Poodle', owner: 'Anna Taylor', tier: 'Standard Member', dates: 'Oct 05 - Oct 06', duration: '1 Night', status: 'Cancelled', statusColor: 'bg-red-100 text-red-700', points: '0 pts' },
              ]
                .filter((r) => activeTab === 'All Requests' || r.status === activeTab)
                .map((r) => (
                  <tr key={r.name} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                          <span>{r.emoji}</span>
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">{r.name}</div>
                          <div className="text-xs text-on-surface/60">{r.breed}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-on-surface">{r.owner}</div>
                      <div className="text-xs text-on-surface/60">{r.tier}</div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-on-surface">{r.dates}</div>
                      <div className="text-xs text-on-surface/60">{r.duration}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${r.statusColor}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary">{r.points}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 text-on-surface/60">
                        <button className="p-2 hover:bg-surface-container rounded-lg"><span>👁️</span></button>
                        <button className="p-2 hover:bg-surface-container rounded-lg"><span>⋮</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-surface-container border-t border-outline/10 flex items-center justify-between text-sm text-on-surface/70">
          <div>Showing <span className="font-semibold">1–5</span> of <span className="font-semibold">42</span> requests</div>
          <div className="flex gap-2">
            <button className="p-2 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/60 disabled:opacity-50" disabled>‹</button>
            <button className="p-2 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/80">›</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[
          { label: 'Completion Rate', value: '94.2%', delta: '↑ 2%', deltaColor: 'text-emerald-500' },
          { label: 'Avg. Response Time', value: '18m', delta: '↓ 4m', deltaColor: 'text-emerald-500' },
          { label: 'Total Points Exchanged', value: '12.4k', delta: 'pts', deltaColor: 'text-primary' },
          { label: 'Active Caretakers', value: '156', delta: 'members', deltaColor: 'text-on-surface/60' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-6 rounded-xl border border-outline/20 shadow-sm">
            <div className="text-on-surface/70 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-black text-on-surface">{stat.value}</div>
              <div className={`${stat.deltaColor} text-xs font-bold flex items-center mb-1`}>{stat.delta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
