'use client';

import { useState, useMemo } from 'react';
import ConfirmationModal from './ConfirmationModal';

type Species = 'Dog' | 'Cat' | 'Other';
type EnergyLevel = 'Low' | 'Medium' | 'High';

interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  ownerName: string;
  ownerEmail: string;
  dob: string;
  energyLevel: EnergyLevel;
  tags: string[];
}

const MOCK_PETS: Pet[] = [
  { id: 'p1', name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', ownerName: 'Sarah Johnson', ownerEmail: 'sarah.j@example.com', dob: '2019-06-10', energyLevel: 'High', tags: ['Vaccinated'] },
  { id: 'p2', name: 'Luna', species: 'Cat', breed: 'Siamese', ownerName: 'Mike Ross', ownerEmail: 'mike.ross@example.com', dob: '2021-02-20', energyLevel: 'Low', tags: ['Indoor only'] },
  { id: 'p3', name: 'Max', species: 'Dog', breed: 'Beagle', ownerName: 'Emily Davis', ownerEmail: 'emily.d@example.com', dob: '2020-11-05', energyLevel: 'High', tags: ['Special needs', 'Vaccinated'] },
  { id: 'p4', name: 'Bella', species: 'Other', breed: 'Rabbit', ownerName: 'Chris Parker', ownerEmail: 'chris.p@example.com', dob: '2022-04-01', energyLevel: 'Medium', tags: [] },
  { id: 'p5', name: 'Oliver', species: 'Cat', breed: 'Persian', ownerName: 'Anna Taylor', ownerEmail: 'anna.t@example.com', dob: '2018-09-15', energyLevel: 'Low', tags: ['Indoor only', 'Senior'] },
  { id: 'p6', name: 'Charlie', species: 'Dog', breed: 'Poodle', ownerName: 'David Wilson', ownerEmail: 'david.w@example.com', dob: '2021-07-22', energyLevel: 'Medium', tags: ['Vaccinated'] },
  { id: 'p7', name: 'Mochi', species: 'Cat', breed: 'Maine Coon', ownerName: 'Laura Martinez', ownerEmail: 'laura.m@example.com', dob: '2020-03-14', energyLevel: 'Medium', tags: ['Indoor only'] },
  { id: 'p8', name: 'Rocky', species: 'Dog', breed: 'Labrador', ownerName: 'Sarah Johnson', ownerEmail: 'sarah.j@example.com', dob: '2017-12-01', energyLevel: 'High', tags: ['Senior', 'Vaccinated'] },
];

const ENERGY_COLORS: Record<EnergyLevel, string> = {
  Low: 'bg-blue-100 text-blue-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-700',
};

const SPECIES_ICONS: Record<Species, string> = { Dog: '🐶', Cat: '🐱', Other: '🐾' };

function getAge(dob: string): string {
  const birth = new Date(dob);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  return years <= 0 ? '< 1 yr' : `${years} yr${years !== 1 ? 's' : ''}`;
}

export default function PetsTable() {
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<Species | 'All'>('All');
  const [energyFilter, setEnergyFilter] = useState<EnergyLevel | 'All'>('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return pets.filter((p) => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.ownerName.toLowerCase().includes(q) || p.ownerEmail.toLowerCase().includes(q);
      const matchSpecies = speciesFilter === 'All' || p.species === speciesFilter;
      const matchEnergy = energyFilter === 'All' || p.energyLevel === energyFilter;
      return matchSearch && matchSpecies && matchEnergy;
    });
  }, [pets, search, speciesFilter, energyFilter]);

  const deletePet = pets.find((p) => p.id === deleteId);

  const handleDelete = () => {
    if (!deleteId) return;
    setPets((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/40 text-sm">🔍</span>
          <input
            type="search"
            placeholder="Search by pet name or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-lowest border border-outline/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value as Species | 'All')}
          className="px-4 py-2.5 bg-surface-container-lowest border border-outline/30 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">All species</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={energyFilter}
          onChange={(e) => setEnergyFilter(e.target.value as EnergyLevel | 'All')}
          className="px-4 py-2.5 bg-surface-container-lowest border border-outline/30 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">All energy levels</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-surface-container border-b border-outline/10 text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">Pet</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4 hidden sm:table-cell">Age</th>
                <th className="px-6 py-4">Energy</th>
                <th className="px-6 py-4 hidden md:table-cell">Tags</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {filtered.map((pet) => (
                <tr key={pet.id} className="hover:bg-surface-container transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-lg shrink-0">
                        {SPECIES_ICONS[pet.species]}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">{pet.name}</p>
                        <p className="text-xs text-on-surface/60">{pet.breed}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-on-surface font-medium">{pet.ownerName}</p>
                    <p className="text-xs text-on-surface/60">{pet.ownerEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-on-surface/70 hidden sm:table-cell">{getAge(pet.dob)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ENERGY_COLORS[pet.energyLevel]}`}>
                      {pet.energyLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {pet.tags.length === 0 ? (
                        <span className="text-on-surface/40 text-xs">—</span>
                      ) : (
                        pet.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface/70 text-xs">
                            {tag}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setDeleteId(pet.id)}
                      title="Delete pet"
                      className="p-2 hover:bg-red-50 rounded-lg text-error transition-colors"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    No pets match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-surface-container border-t border-outline/10 flex items-center justify-between text-sm text-on-surface/70">
          <div>Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{pets.length}</span> pets</div>
          <div className="flex gap-2">
            <button className="p-2 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/60 disabled:opacity-50" disabled>‹</button>
            <button className="p-2 rounded border border-outline/30 bg-surface-container-lowest text-on-surface/80">›</button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        title={`Delete ${deletePet?.name ?? 'pet'}?`}
        description="This will permanently remove the pet and all associated data."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
