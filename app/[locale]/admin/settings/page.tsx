// Static content for admin settings
const STATIC_SETTINGS = [
  { label: 'Site name', value: 'PawTaker', type: 'text' },
  { label: 'Support email', value: 'support@pawtaker.app', type: 'email' },
  { label: 'Maintenance mode', value: 'Off', type: 'toggle' },
  { label: 'Points per day (boarding)', value: '10', type: 'number' },
  { label: 'Max points per request', value: '500', type: 'number' },
  { label: 'New user sign-up', value: 'Enabled', type: 'toggle' },
  { label: 'KYC required to offer care', value: 'Yes', type: 'toggle' },
];

export default function AdminSettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-8">Settings</h1>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden max-w-2xl">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-[#1A1A2E]">General</h2>
          <p className="text-xs text-gray-500 mt-0.5">App and platform configuration</p>
        </div>
        <ul className="divide-y divide-gray-100">
          {STATIC_SETTINGS.map((s) => (
            <li key={s.label} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1A1A2E]">{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.type}</p>
              </div>
              <span className="text-sm text-gray-600">{s.value}</span>
            </li>
          ))}
        </ul>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-2">
          <button className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Save changes
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
