import { Flag, Save, Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-xl border border-outline/10">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" aria-hidden="true" />
              General Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Site Name</label>
                <input
                  type="text"
                  defaultValue="PawTaker Global"
                  className="w-full px-4 py-3 rounded-lg border border-outline/20 bg-white focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface">Support Email</label>
                <input
                  type="email"
                  defaultValue="support@pawtaker.com"
                  className="w-full px-4 py-3 rounded-lg border border-outline/20 bg-white focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-on-surface">Default Locale</label>
                <select className="w-full px-4 py-3 rounded-lg border border-outline/20 bg-white focus:ring-2 focus:ring-primary/20 outline-none text-sm">
                  <option>English (United States)</option>
                  <option>Spanish (Mexico)</option>
                  <option>French (France)</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-outline/10">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Flag className="h-5 w-5 text-primary" aria-hidden="true" />
              Feature Flags
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg">
                <div>
                  <p className="font-semibold text-sm text-on-surface">Public Registrations</p>
                  <p className="text-xs text-on-surface/70">
                    Allow new users to create accounts on the platform.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-outline/20 peer-focus:outline-none rounded-full peer dark:bg-surface-container peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-outline/20 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg">
                <div>
                  <p className="font-semibold text-sm text-on-surface">AI-Powered Matches</p>
                  <p className="text-xs text-on-surface/70">
                    Use machine learning to suggest pets to potential owners.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-outline/20 peer-focus:outline-none rounded-full peer dark:bg-surface-container peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-outline/20 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg">
                <div>
                  <p className="font-semibold text-sm text-on-surface">Donation Module</p>
                  <p className="text-xs text-on-surface/70">
                    Enable direct donations to shelters within the app.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-outline/20 peer-focus:outline-none rounded-full peer dark:bg-surface-container peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-outline/20 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button className="px-6 py-2.5 rounded-full border border-outline/20 text-primary font-bold text-sm hover:bg-surface-container-lowest transition-colors">
              Reset to Default
            </button>
            <button className="px-8 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
              <Save className="h-4 w-4" aria-hidden="true" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
