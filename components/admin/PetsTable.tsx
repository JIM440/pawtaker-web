'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ConfirmationModal from './ConfirmationModal';
import LabeledSearch from './LabeledSearch';
import LabeledSelect from './LabeledSelect';
import UserAvatar from './UserAvatar';
import { useToast } from '@/components/ui/ToastProvider';
import { useAdminPetsQuery, useDeleteAdminPetMutation } from '@/lib/queries/admin/pets';
import Skeleton from '@/components/ui/Skeleton';

type Species = string;
type CareSort = 'most' | 'least';

interface Pet {
  id: string;
  name: string;
  image: string;
  species: Species;
  breed: string;
  ownerName: string;
  ownerImage: string;
  ownerEmail: string;
  dob: string;
  tags: string[];
  careRequests: number;
}

function getAge(dob: string): string {
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return dob || '< 1 yr';
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  return years <= 0 ? '< 1 yr' : `${years} yr${years !== 1 ? 's' : ''}`;
}

function PetRowActionsMenu({
  petId,
  petName,
  onDelete,
}: {
  petId: string;
  petName: string;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations('admin.pets');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded-full p-2 text-on-surface/50 transition-colors hover:bg-white hover:text-on-surface"
        aria-label={t('openActionsAriaLabel', { petName })}
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-lg border border-outline/20 bg-white py-1 shadow-lg ring-1 ring-black/5">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(petId);
            }}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-error hover:bg-error/5"
          >
            <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t('deleteConfirmLabel')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function PetsTable() {
  const t = useTranslations('admin.pets');
  const tModal = useTranslations('admin.modal');
  const { showToast } = useToast();
  const petsQuery = useAdminPetsQuery();
  const deletePetMutation = useDeleteAdminPetMutation();
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<Species | 'All'>('All');
  const [careRequestsSort, setCareRequestsSort] = useState<CareSort>('most');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const pets = useMemo(() => (petsQuery.data ?? []) as Pet[], [petsQuery.data]);

  const speciesOptions = useMemo(() => {
    const speciesSet = new Set<string>();
    for (const p of pets) {
      if (p.species) speciesSet.add(p.species);
    }
    const speciesList = Array.from(speciesSet.values()).sort((a, b) => a.localeCompare(b));
    return [
      { value: 'All' as const, label: t('allSpecies') },
      ...speciesList.map((s) => ({
        value: s,
        label: s === 'Dog' ? t('speciesDog') : s === 'Cat' ? t('speciesCat') : s === 'Other' ? t('speciesOther') : s,
      })),
    ];
  }, [pets, t]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = pets.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.ownerEmail.toLowerCase().includes(q);
      const matchSpecies = speciesFilter === 'All' || p.species === speciesFilter;
      return matchSearch && matchSpecies;
    });

    const sorted = [...base].sort((a, b) => {
      if (careRequestsSort === 'most') return b.careRequests - a.careRequests;
      return a.careRequests - b.careRequests;
    });

    return sorted;
  }, [pets, search, speciesFilter, careRequestsSort]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePetMutation.mutateAsync(deleteId);
      showToast(t('deleteConfirmLabel'), 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete pet.', 'error');
    }
    setDeleteId(null);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
          <div className="w-full sm:w-fit">
            <LabeledSelect
              id="pets-species-filter"
              label={t('filterSpecies')}
              value={speciesFilter}
              onChange={(next) => setSpeciesFilter(next as Species | 'All')}
              options={speciesOptions}
            />
          </div>
          <div className="w-full sm:w-fit">
            <LabeledSelect
              id="pets-care-requests-sort"
              label={t('careRequestsSortLabel')}
              value={careRequestsSort}
              onChange={(next) => setCareRequestsSort(next as CareSort)}
              options={[
                { value: 'most', label: t('careRequestsSortMost') },
                { value: 'least', label: t('careRequestsSortLeast') },
              ]}
            />
          </div>
        </div>

        <div className="w-full sm:max-w-md">
          <LabeledSearch
            id="pets-search"
            label={t('searchLabel')}
            value={search}
            placeholder={t('searchPlaceholder')}
            onChange={setSearch}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline/20 shadow-sm">
        <div className="overflow-x-auto min-w-0 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-white border-b border-outline/10 text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">{t('columns.pet')}</th>
                <th className="px-6 py-4">{t('columns.owner')}</th>
                <th className="px-6 py-4 hidden sm:table-cell">{t('columns.age')}</th>
                <th className="px-6 py-4">{t('columns.careRequests')}</th>
                <th className="px-6 py-4 hidden md:table-cell">{t('filterSpecies')}</th>
                <th className="px-6 py-4 text-center">{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {petsQuery.isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface/70 hidden sm:table-cell">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-7 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Skeleton className="h-7 w-24 rounded-full" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                    </td>
                  </tr>
                ))}
              {petsQuery.isError && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    <p className="mb-3">
                      {petsQuery.error instanceof Error ? petsQuery.error.message : 'Failed to load pets.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => petsQuery.refetch()}
                      className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              )}
              {!petsQuery.isLoading && !petsQuery.isError && filtered.map((pet) => (
                <tr key={pet.id} className="hover:bg-white transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="size-9 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-on-surface">{pet.name}</p>
                        <p className="text-xs text-on-surface/60">{pet.breed}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <UserAvatar
                        imageUrl={pet.ownerImage}
                        initials={pet.ownerName
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((s) => s[0]?.toUpperCase())
                          .join('')}
                        alt={pet.ownerName}
                        size={32}
                      />
                      <div>
                        <p className="text-on-surface font-medium">{pet.ownerName}</p>
                        <p className="text-xs text-on-surface/60">{pet.ownerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-on-surface/70 hidden sm:table-cell">
                    {getAge(pet.dob)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {pet.careRequests}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {pet.species === 'Dog'
                        ? t('speciesDog')
                        : pet.species === 'Cat'
                          ? t('speciesCat')
                          : pet.species === 'Other'
                            ? t('speciesOther')
                            : pet.species}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <PetRowActionsMenu
                      petId={pet.id}
                      petName={pet.name}
                      onDelete={(id) => setDeleteId(id)}
                    />
                  </td>
                </tr>
              ))}

              {!petsQuery.isLoading && !petsQuery.isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-on-surface/50">
                    {t('emptyState')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-white border-t border-outline/10 flex items-center justify-between text-sm text-on-surface/70">
          <div>
            {t('paginationShowing', { shown: filtered.length, total: pets.length })}
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 rounded border border-outline/30 bg-white text-on-surface/60 disabled:opacity-50"
              disabled
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button className="p-2 rounded border border-outline/30 bg-white text-on-surface/80">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        title={t('deleteConfirmTitle')}
        description={t('deleteConfirmDesc')}
        confirmLabel={t('deleteConfirmLabel')}
        cancelLabel={tModal('cancel')}
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
