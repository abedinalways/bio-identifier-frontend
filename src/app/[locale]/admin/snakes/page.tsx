'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useGetSnakesListQuery } from '@/store/api/snakeApi';
import {
  useCreateSnakeMutation,
  useUpdateSnakeMutation,
  useDeleteSnakeMutation,
} from '@/store/api/adminApi';
import type { ISnake } from '@/core/interfaces';
import { ImageInputSelector } from '@/components/admin/ImageInputSelector';

export default function AdminSnakesPage() {
  const { data: snakes = [], isLoading, refetch } = useGetSnakesListQuery();
  const [createSnake, { isLoading: isCreating }] = useCreateSnakeMutation();
  const [updateSnake, { isLoading: isUpdating }] = useUpdateSnakeMutation();
  const [deleteSnake, { isLoading: isDeleting }] = useDeleteSnakeMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'venomous' | 'harmless'>(
    'all',
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnake, setEditingSnake] = useState<ISnake | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Form Fields
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameBn, setFormNameBn] = useState('');
  const [formScientific, setFormScientific] = useState('');
  const [formFamily, setFormFamily] = useState('Viperidae');
  const [formIsVenomous, setFormIsVenomous] = useState(true);
  const [formDangerLevel, setFormDangerLevel] = useState<
    'deadly' | 'mild' | 'harmless'
  >('deadly');
  const [formVenomCategory, setFormVenomCategory] = useState<
    'neurotoxic' | 'hemotoxic' | 'cytotoxic' | 'myotoxic' | 'non_venomous'
  >('hemotoxic');
  const [formAntivenomType, setFormAntivenomType] = useState(
    'Polyvalent Anti-Snake Venom (ASV)',
  );
  const [formBrands, setFormBrands] = useState(
    'Incepta Antivenom, Bharat Serums ASV',
  );
  const [formImageUrl, setFormImageUrl] = useState(
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  );
  const [formHabitat, setFormHabitat] = useState(
    'Agricultural fields, tea gardens, tall grass',
  );

  const openCreateModal = () => {
    setEditingSnake(null);
    setFormNameEn('');
    setFormNameBn('');
    setFormScientific('');
    setFormFamily('Viperidae');
    setFormIsVenomous(true);
    setFormDangerLevel('deadly');
    setFormVenomCategory('hemotoxic');
    setFormAntivenomType('Polyvalent Anti-Snake Venom (ASV)');
    setFormBrands('Incepta Antivenom, Bharat Serums ASV');
    setFormImageUrl(
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    );
    setFormHabitat('Forests, grasslands, and farmland');
    setErrorText(null);
    setIsModalOpen(true);
  };

  const openEditModal = (snake: ISnake) => {
    setEditingSnake(snake);
    setFormNameEn(snake.commonName?.en || '');
    setFormNameBn(snake.commonName?.bn || '');
    setFormScientific(snake.scientificName || '');
    setFormFamily(snake.family || 'Squamata');
    setFormIsVenomous(Boolean(snake.venomProfile?.isVenomous));
    setFormDangerLevel(snake.venomProfile?.dangerLevel || 'deadly');
    setFormVenomCategory(snake.venomProfile?.venomCategory || 'hemotoxic');
    setFormAntivenomType(snake.venomProfile?.antivenomType || 'Polyvalent ASV');
    setFormBrands((snake.venomProfile?.commercialBrands || []).join(', '));
    setFormImageUrl(snake.imageUrl || '');
    setFormHabitat(snake.habitat || '');
    setErrorText(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    const brandsArray = formBrands
      .split(',')
      .map(b => b.trim())
      .filter(Boolean);

    const payload = {
      scientificName: formScientific.trim(),
      family: formFamily.trim(),
      commonNames: {
        en: formNameEn.trim(),
        bn: formNameBn.trim() || formNameEn.trim(),
      },
      isVenomous: formIsVenomous,
      dangerLevel: formDangerLevel,
      venomCategory: formVenomCategory,
      antivenomRequired: formIsVenomous,
      antivenomType: formAntivenomType,
      commercialBrands: brandsArray,
      targetToxins: ['Procoagulants', 'Phospholipase A2'],
      lethalityRisk: formIsVenomous
        ? 'Critical Envenomation Risk'
        : 'Non-lethal',
      habitat: formHabitat,
      distribution: ['South Asia', 'Bangladesh', 'India'],
      imageUrl: formImageUrl,
      firstAidSteps: [
        'Immobilize bitten limb with a rigid splint.',
        'Do NOT tie tight tourniquets or cut bite wound.',
        'Transfer immediately to emergency hospital with ASV.',
      ],
      mythsDebunked: [
        'Snakes do not drink milk',
        'Carbolic acid does not deter snakes',
      ],
      ecologicalImportance:
        'Keeps rodent and pest populations under natural balance.',
    };

    try {
      if (editingSnake) {
        await updateSnake({ id: editingSnake.id, data: payload }).unwrap();
      } else {
        const generatedId = formScientific
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 30);
        await createSnake({ ...payload, id: generatedId }).unwrap();
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      console.error('Failed to save snake species:', err);
      setErrorText(
        err?.data?.message ||
          err?.message ||
          'Failed to save species. Please check details.',
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete '${name}' from database?`)) {
      try {
        await deleteSnake(id).unwrap();
        refetch();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete snake species.');
      }
    }
  };

  const filteredSnakes = useMemo(() => {
    return snakes.filter(snake => {
      if (filterType === 'venomous' && !snake.venomProfile?.isVenomous)
        return false;
      if (filterType === 'harmless' && snake.venomProfile?.isVenomous)
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const en = snake.commonName?.en?.toLowerCase() || '';
        const bn = snake.commonName?.bn?.toLowerCase() || '';
        const sc = snake.scientificName?.toLowerCase() || '';
        const fam = snake.family?.toLowerCase() || '';
        if (
          !en.includes(q) &&
          !bn.includes(q) &&
          !sc.includes(q) &&
          !fam.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [snakes, filterType, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-venom-deadly" />
            <span>Snakes & ASV Encyclopedia</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Maintain venomous and harmless snake taxa, danger risk levels, and
            antivenom protocols.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Species</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by common name, scientific name, or family..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border-subtle bg-bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <div className="flex rounded-xl bg-bg-surface border border-border-subtle p-1 self-start">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All ({snakes.length})
          </button>
          <button
            onClick={() => setFilterType('venomous')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterType === 'venomous'
                ? 'bg-venom-deadly text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Venomous
          </button>
          <button
            onClick={() => setFilterType('harmless')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterType === 'harmless'
                ? 'bg-emerald-600 text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Harmless
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-3xl bg-bg-surface border border-border-subtle shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center gap-2 text-text-muted text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
            <span>Loading snake encyclopedia...</span>
          </div>
        ) : filteredSnakes.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-xs">
            No snake species matched your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-subtle text-text-secondary uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-4">Species</th>
                  <th className="p-4">Scientific Name & Family</th>
                  <th className="p-4">Venom / Danger</th>
                  <th className="p-4">Required ASV Antivenom</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredSnakes.map(snake => {
                  const isVenom = snake.venomProfile?.isVenomous;
                  return (
                    <tr
                      key={snake.id}
                      className="hover:bg-bg-subtle/50 transition"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-bg-subtle shrink-0 relative">
                            <Image
                              src={snake.imageUrl}
                              alt={snake.commonName?.en || 'Snake'}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                            {snake.imageUrl?.startsWith('data:') ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={snake.imageUrl}
                                alt={snake.commonName?.en || 'Snake'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Image
                                src={snake.imageUrl}
                                alt={snake.commonName?.en || 'Snake'}
                                fill
                                unoptimized
                                className="object-cover"
                                sizes="48px"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-text-primary">
                              {snake.commonName?.en}
                            </div>
                            <div className="text-xs text-text-muted">
                              {snake.commonName?.bn}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold italic text-text-primary">
                          {snake.scientificName}
                        </div>
                        <div className="text-[11px] text-text-muted">
                          Family: {snake.family}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            isVenom
                              ? 'bg-venom-deadly/15 text-venom-deadly border border-venom-deadly/30'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {isVenom ? (
                            <ShieldAlert className="w-3 h-3" />
                          ) : (
                            <ShieldCheck className="w-3 h-3" />
                          )}
                          <span>
                            {snake.venomProfile?.dangerLevel ||
                              (isVenom ? 'deadly' : 'harmless')}
                          </span>
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-text-primary font-medium">
                          {snake.venomProfile?.antivenomType || 'None Required'}
                        </div>
                        {snake.venomProfile?.commercialBrands?.length ? (
                          <div className="text-[10px] text-text-muted truncate max-w-xs">
                            Brands:{' '}
                            {snake.venomProfile.commercialBrands.join(', ')}
                          </div>
                        ) : null}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(snake)}
                            className="p-2 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 transition cursor-pointer"
                            title="Edit Snake"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(
                                snake.id,
                                snake.commonName?.en || snake.scientificName,
                              )
                            }
                            className="p-2 rounded-lg text-text-secondary hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition cursor-pointer"
                            title="Delete Snake"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog (Create / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-bg-surface rounded-3xl border border-border-subtle shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  {editingSnake
                    ? 'Edit Snake Species'
                    : 'Add New Snake Species'}
                </h3>
                <p className="text-xs text-text-secondary">
                  Configure biological taxonomy and clinical emergency profile.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorText && (
              <div className="p-3 rounded-xl bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorText}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    English Common Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formNameEn}
                    onChange={e => setFormNameEn(e.target.value)}
                    placeholder="Russell's Viper"
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Bengali Common Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formNameBn}
                    onChange={e => setFormNameBn(e.target.value)}
                    placeholder="চন্দ্রবোড়া / রাসেলস ভাইপার"
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Scientific Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formScientific}
                    onChange={e => setFormScientific(e.target.value)}
                    placeholder="Daboia russelii"
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">Family</label>
                  <input
                    type="text"
                    required
                    value={formFamily}
                    onChange={e => setFormFamily(e.target.value)}
                    placeholder="Viperidae"
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Venomous Status
                  </label>
                  <select
                    value={formIsVenomous ? 'yes' : 'no'}
                    onChange={e => setFormIsVenomous(e.target.value === 'yes')}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  >
                    <option value="yes">Venomous (Requires ASV)</option>
                    <option value="no">Non-Venomous (Harmless)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Danger Level
                  </label>
                  <select
                    value={formDangerLevel}
                    onChange={e => setFormDangerLevel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  >
                    <option value="deadly">Deadly (Critical)</option>
                    <option value="mild">Mild</option>
                    <option value="harmless">Harmless</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Venom Category
                  </label>
                  <select
                    value={formVenomCategory}
                    onChange={e => setFormVenomCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  >
                    <option value="hemotoxic">Hemotoxic</option>
                    <option value="neurotoxic">Neurotoxic</option>
                    <option value="cytotoxic">Cytotoxic</option>
                    <option value="myotoxic">Myotoxic</option>
                    <option value="non_venomous">Non-Venomous</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-primary">
                  Antivenom Type
                </label>
                <input
                  type="text"
                  value={formAntivenomType}
                  onChange={e => setFormAntivenomType(e.target.value)}
                  placeholder="Polyvalent Anti-Snake Venom (ASV) Serum"
                  className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-primary">
                  Commercial ASV Brands (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formBrands}
                  onChange={e => setFormBrands(e.target.value)}
                  placeholder="Incepta Antivenom, Bharat Serums ASV, Haffkine"
                  className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                />
              </div>

              <ImageInputSelector
                label="Specimen Photo (Upload File or Web Link)"
                value={formImageUrl}
                onChange={setFormImageUrl}
                required
              />

              <div className="space-y-1">
                <label className="font-bold text-text-primary">
                  Habitat & Geographic Distribution
                </label>
                <textarea
                  rows={2}
                  value={formHabitat}
                  onChange={e => setFormHabitat(e.target.value)}
                  placeholder="Tea plantations, paddy fields, alluvial plains"
                  className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border-subtle text-text-secondary hover:bg-bg-subtle font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>
                      {editingSnake ? 'Update Species' : 'Create Species'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
