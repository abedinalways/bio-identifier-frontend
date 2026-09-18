'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Bug,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Sprout,
  ShieldAlert,
} from 'lucide-react';
import { useGetPestsListQuery } from '@/store/api/pestApi';
import {
  useCreatePestMutation,
  useUpdatePestMutation,
  useDeletePestMutation,
} from '@/store/api/adminApi';
import type { IPest } from '@/core/interfaces';
import { ImageInputSelector } from '@/components/admin/ImageInputSelector';

export default function AdminPestsPage() {
  const { data: pests = [], isLoading, refetch } = useGetPestsListQuery();
  const [createPest, { isLoading: isCreating }] = useCreatePestMutation();
  const [updatePest, { isLoading: isUpdating }] = useUpdatePestMutation();
  const [deletePest, { isLoading: isDeleting }] = useDeletePestMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'crop_pest' | 'stinging_insect'
  >('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPest, setEditingPest] = useState<IPest | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Form Fields
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameBn, setFormNameBn] = useState('');
  const [formScientific, setFormScientific] = useState('');
  const [formCategory, setFormCategory] = useState<
    'crop_pest' | 'stinging_insect'
  >('crop_pest');
  const [formCrops, setFormCrops] = useState('mango, litchi');
  const [formSeverity, setFormSeverity] = useState<
    'critical' | 'moderate' | 'low'
  >('critical');
  const [formSymptoms, setFormSymptoms] = useState(
    'Withering flower buds, sooty leaf discoloration',
  );
  const [formDamageMechanism, setFormDamageMechanism] = useState(
    'Nymphs and adults suck phloem sap, inducing flower drop.',
  );
  const [formYieldLoss, setFormYieldLoss] = useState(
    'Up to 50-80% flower damage in unsprayed orchards',
  );
  const [formImageUrl, setFormImageUrl] = useState(
    'https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&w=800&q=80',
  );

  // Treatment Fields
  const [treatType, setTreatType] = useState<'organic' | 'chemical'>('organic');
  const [treatTitle, setTreatTitle] = useState('Neem Oil Botanical Spray');
  const [treatIngredient, setTreatIngredient] = useState(
    'Azadirachtin 0.03% EC',
  );
  const [treatDosage, setTreatDosage] = useState(4.0);
  const [treatUnit, setTreatUnit] = useState<'ml' | 'g'>('ml');
  const [treatTiming, setTreatTiming] = useState(
    'Spray in the early morning before flower blossoms open',
  );
  const [treatSafety, setTreatSafety] = useState(
    'Wear protective mask and gloves. Avoid water contamination.',
  );

  const openCreateModal = () => {
    setEditingPest(null);
    setFormNameEn('');
    setFormNameBn('');
    setFormScientific('');
    setFormCategory('crop_pest');
    setFormCrops('mango, rice');
    setFormSeverity('critical');
    setFormSymptoms('Yellowing leaves, sap depletion');
    setFormDamageMechanism(
      'Insects feed on vegetative parts and transmission of viral pathogens.',
    );
    setFormYieldLoss('Significant harvest reduction if unaddressed');
    setFormImageUrl(
      'https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&w=800&q=80',
    );
    setTreatType('organic');
    setTreatTitle('Bio-Pesticide Foliar Application');
    setTreatIngredient('Neem Seed Kernel Extract');
    setTreatDosage(5.0);
    setTreatUnit('ml');
    setTreatTiming('Apply during early infestation stages');
    setTreatSafety('Wear standard PPE during preparation and spraying.');
    setErrorText(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pest: IPest) => {
    setEditingPest(pest);
    setFormNameEn(pest.commonName?.en || '');
    setFormNameBn(pest.commonName?.bn || '');
    setFormScientific(pest.scientificName || '');
    setFormCategory(pest.category || 'crop_pest');
    setFormCrops((pest.damageProfile?.affectedCrops || []).join(', '));
    setFormSeverity(pest.damageProfile?.severity || 'critical');
    setFormSymptoms((pest.damageProfile?.symptoms || []).join(', '));
    setFormDamageMechanism(pest.damageProfile?.damageMechanism || '');
    setFormYieldLoss(pest.damageProfile?.yieldLossPotential || '');
    setFormImageUrl(pest.imageUrl || '');

    const t = pest.treatments?.[0];
    if (t) {
      setTreatType(t.type === 'chemical' ? 'chemical' : 'organic');
      setTreatTitle(t.title);
      setTreatIngredient(t.activeIngredient);
      setTreatDosage(t.dosagePerLiter);
      setTreatUnit(t.dosageUnit as any);
      setTreatTiming(t.optimalTiming);
      setTreatSafety(t.safetyInstructions);
    }
    setErrorText(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    const cropsArray = formCrops
      .split(',')
      .map(c => c.trim().toLowerCase())
      .filter(Boolean);

    const symptomsArray = formSymptoms
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      scientificName: formScientific.trim(),
      commonNames: {
        en: formNameEn.trim(),
        bn: formNameBn.trim() || formNameEn.trim(),
      },
      category: formCategory,
      affectedCrops: cropsArray,
      severity: formSeverity,
      symptoms: symptomsArray,
      damageMechanism: formDamageMechanism.trim(),
      yieldLossPotential: formYieldLoss.trim(),
      imageUrl: formImageUrl.trim(),
      treatments: [
        {
          type: treatType,
          title: treatTitle.trim(),
          activeIngredient: treatIngredient.trim(),
          dosagePerLiter: Number(treatDosage),
          dosageUnit: treatUnit,
          commercialExamples: ['Bio-Gard 5EC', 'EcoPest Sol'],
          optimalTiming: treatTiming.trim(),
          preHarvestIntervalDays: treatType === 'organic' ? 1 : 14,
          safetyInstructions: treatSafety.trim(),
        },
      ],
    };

    try {
      if (editingPest) {
        await updatePest({ id: editingPest.id, data: payload }).unwrap();
      } else {
        const generatedId = formScientific
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 30);
        await createPest({ ...payload, id: generatedId }).unwrap();
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      console.error('Failed to save pest:', err);
      setErrorText(
        err?.data?.message || err?.message || 'Failed to save pest.',
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete '${name}' from database?`)) {
      try {
        await deletePest(id).unwrap();
        refetch();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete pest.');
      }
    }
  };

  const filteredPests = useMemo(() => {
    return pests.filter(pest => {
      if (categoryFilter !== 'all' && pest.category !== categoryFilter)
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const en = pest.commonName?.en?.toLowerCase() || '';
        const bn = pest.commonName?.bn?.toLowerCase() || '';
        const sc = pest.scientificName?.toLowerCase() || '';
        const crops = (pest.damageProfile?.affectedCrops || [])
          .join(' ')
          .toLowerCase();
        if (
          !en.includes(q) &&
          !bn.includes(q) &&
          !sc.includes(q) &&
          !crops.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [pests, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight flex items-center gap-2.5">
            <Bug className="w-7 h-7 text-amber-500" />
            <span>Pests & Crop Remedies Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Maintain agricultural entomology profiles, crop damage symptoms, and
            pesticide dosage recipes.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pest</span>
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
            placeholder="Search by pest name, scientific name, or target crop..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border-subtle bg-bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <div className="flex rounded-xl bg-bg-surface border border-border-subtle p-1 self-start">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All ({pests.length})
          </button>
          <button
            onClick={() => setCategoryFilter('crop_pest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              categoryFilter === 'crop_pest'
                ? 'bg-amber-500 text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Crop Pests
          </button>
          <button
            onClick={() => setCategoryFilter('stinging_insect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              categoryFilter === 'stinging_insect'
                ? 'bg-red-500 text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Stinging Insects
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-3xl bg-bg-surface border border-border-subtle shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center gap-2 text-text-muted text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
            <span>Loading pests encyclopedia...</span>
          </div>
        ) : filteredPests.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-xs">
            No pests matched your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-subtle text-text-secondary uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-4">Pest Specimen</th>
                  <th className="p-4">Scientific Name</th>
                  <th className="p-4">Target Crops</th>
                  <th className="p-4">Severity / Remedies</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredPests.map(pest => (
                  <tr
                    key={pest.id}
                    className="hover:bg-bg-subtle/50 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-bg-subtle shrink-0 relative">
                          <Image
                            src={pest.imageUrl}
                            alt={pest.commonName?.en || 'Pest'}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                          {pest.imageUrl?.startsWith('data:') ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={pest.imageUrl}
                              alt={pest.commonName?.en || 'Pest'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={pest.imageUrl}
                              alt={pest.commonName?.en || 'Pest'}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-text-primary">
                            {pest.commonName?.en}
                          </div>
                          <div className="text-xs text-text-muted">
                            {pest.commonName?.bn}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold italic text-text-primary">
                        {pest.scientificName}
                      </div>
                      <div className="text-[10px] text-text-muted uppercase font-bold mt-0.5">
                        {pest.category === 'stinging_insect'
                          ? 'Stinging Insect'
                          : 'Agricultural Pest'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {pest.damageProfile?.affectedCrops?.map(crop => (
                          <span
                            key={crop}
                            className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20 uppercase"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            pest.damageProfile?.severity === 'critical'
                              ? 'bg-red-500/15 text-red-600 border border-red-500/20'
                              : 'bg-amber-500/15 text-amber-600 border border-amber-500/20'
                          }`}
                        >
                          {pest.damageProfile?.severity} severity
                        </span>
                        <div className="text-[11px] text-text-muted">
                          {pest.treatments?.length || 0} Calibrated Treatment(s)
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(pest)}
                          className="p-2 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 transition cursor-pointer"
                          title="Edit Pest"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              pest.id,
                              pest.commonName?.en || pest.scientificName,
                            )
                          }
                          className="p-2 rounded-lg text-text-secondary hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition cursor-pointer"
                          title="Delete Pest"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog (Create / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-bg-surface rounded-3xl border border-border-subtle shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  {editingPest
                    ? 'Edit Pest Profile'
                    : 'Add New Agricultural Pest'}
                </h3>
                <p className="text-xs text-text-secondary">
                  Specify crop damage characteristics and calibrated dosage
                  remedy.
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
                    placeholder="Mango Leaf Hopper"
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
                    placeholder="আমের হপার পোকা"
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
                    placeholder="Idioscopus clypealis"
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  >
                    <option value="crop_pest">Crop Pest</option>
                    <option value="stinging_insect">Stinging Insect</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Target Crops (Comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formCrops}
                    onChange={e => setFormCrops(e.target.value)}
                    placeholder="mango, litchi, rice"
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Infestation Severity
                  </label>
                  <select
                    value={formSeverity}
                    onChange={e => setFormSeverity(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  >
                    <option value="critical">Critical</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-primary">
                  Visual Symptoms (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formSymptoms}
                  onChange={e => setFormSymptoms(e.target.value)}
                  placeholder="Flower withering, sticky honeydew, sooty mold"
                  className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                />
              </div>

              <ImageInputSelector
                label="Pest Specimen Photo (Upload File or Web Link)"
                value={formImageUrl}
                onChange={setFormImageUrl}
                required
              />

              {/* Treatment Recipe Section */}
              <div className="p-4 rounded-2xl bg-bg-subtle border border-border-subtle space-y-3">
                <div className="font-bold text-xs text-brand-primary flex items-center gap-1.5">
                  <Sprout className="w-4 h-4" />
                  <span>Primary Treatment Protocol & Chemical Formulation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-text-primary">
                      Treatment Type
                    </label>
                    <select
                      value={treatType}
                      onChange={e => setTreatType(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-border-subtle bg-bg-canvas text-text-primary"
                    >
                      <option value="organic">Organic / Bio-Botanical</option>
                      <option value="chemical">Chemical Pesticide</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-text-primary">
                      Protocol Title
                    </label>
                    <input
                      type="text"
                      required
                      value={treatTitle}
                      onChange={e => setTreatTitle(e.target.value)}
                      placeholder="Botanical Neem Emulsion"
                      className="w-full p-2 rounded-lg border border-border-subtle bg-bg-canvas text-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-text-primary">
                      Active Ingredient
                    </label>
                    <input
                      type="text"
                      required
                      value={treatIngredient}
                      onChange={e => setTreatIngredient(e.target.value)}
                      placeholder="Azadirachtin 0.03%"
                      className="w-full p-2 rounded-lg border border-border-subtle bg-bg-canvas text-text-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-text-primary">
                      Dose per Liter
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={treatDosage}
                      onChange={e => setTreatDosage(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-border-subtle bg-bg-canvas text-text-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-text-primary">Unit</label>
                    <select
                      value={treatUnit}
                      onChange={e => setTreatUnit(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-border-subtle bg-bg-canvas text-text-primary"
                    >
                      <option value="ml">ml / Liter</option>
                      <option value="g">g / Liter</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Optimal Timing
                  </label>
                  <input
                    type="text"
                    value={treatTiming}
                    onChange={e => setTreatTiming(e.target.value)}
                    placeholder="Spray early morning when flower panicles are 5-10cm"
                    className="w-full p-2 rounded-lg border border-border-subtle bg-bg-canvas text-text-primary"
                  />
                </div>
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
                    <span>{editingPest ? 'Update Pest' : 'Create Pest'}</span>
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
