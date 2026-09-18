'use client';

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  MapPin,
  PhoneCall,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useGetEmergencyHospitalsQuery } from '@/store/api/emergencyApi';
import {
  useCreateHospitalMutation,
  useUpdateHospitalMutation,
  useDeleteHospitalMutation,
} from '@/store/api/adminApi';
import type { IEmergencyHospital } from '@/core/interfaces';

export default function AdminHospitalsPage() {
  const {
    data: hospitals = [],
    isLoading,
    refetch,
  } = useGetEmergencyHospitalsQuery();
  const [createHospital, { isLoading: isCreating }] =
    useCreateHospitalMutation();
  const [updateHospital, { isLoading: isUpdating }] =
    useUpdateHospitalMutation();
  const [deleteHospital, { isLoading: isDeleting }] =
    useDeleteHospitalMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] =
    useState<IEmergencyHospital | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCountry, setFormCountry] = useState('BD');
  const [formDivision, setFormDivision] = useState('Dhaka');
  const [formDistrict, setFormDistrict] = useState('Dhaka');
  const [formAddress, setFormAddress] = useState('');
  const [formHotline, setFormHotline] = useState('+8801700000000');
  const [formLatitude, setFormLatitude] = useState(23.7258);
  const [formLongitude, setFormLongitude] = useState(90.3976);
  const [formHasAsv, setFormHasAsv] = useState(true);
  const [formIcu, setFormIcu] = useState(true);
  const [formUnit, setFormUnit] = useState(
    'Toxicology & Snakebite Emergency Unit',
  );

  const openCreateModal = () => {
    setEditingHospital(null);
    setFormName('');
    setFormCountry('BD');
    setFormDivision('Dhaka');
    setFormDistrict('Dhaka');
    setFormAddress('');
    setFormHotline('+8801700000000');
    setFormLatitude(23.7258);
    setFormLongitude(90.3976);
    setFormHasAsv(true);
    setFormIcu(true);
    setFormUnit('One-Stop Emergency & ASV Ward');
    setErrorText(null);
    setIsModalOpen(true);
  };

  const openEditModal = (h: IEmergencyHospital) => {
    setEditingHospital(h);
    setFormName(h.name);
    setFormCountry(h.country);
    setFormDivision(h.division || 'Dhaka');
    setFormDistrict(h.district);
    setFormAddress(h.address);
    setFormHotline(h.hotline);
    setFormLatitude(h.latitude);
    setFormLongitude(h.longitude);
    setFormHasAsv(h.hasAntivenomStock);
    setFormIcu(h.icuAvailable !== false);
    setFormUnit(h.emergencyUnit || '');
    setErrorText(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    const payload = {
      name: formName.trim(),
      country: formCountry.toUpperCase(),
      division: formDivision.trim(),
      district: formDistrict.trim(),
      address: formAddress.trim(),
      hotline: formHotline.trim(),
      latitude: Number(formLatitude),
      longitude: Number(formLongitude),
      hasAntivenomStock: formHasAsv,
      icuAvailable: formIcu,
      emergencyUnit: formUnit.trim(),
    };

    try {
      if (editingHospital) {
        await updateHospital({
          id: editingHospital.id,
          data: payload,
        }).unwrap();
      } else {
        const generatedId = formName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 30);
        await createHospital({ ...payload, id: generatedId }).unwrap();
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      console.error('Failed to save hospital:', err);
      setErrorText(
        err?.data?.message || err?.message || 'Failed to save hospital.',
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to remove '${name}' from hospital directory?`,
      )
    ) {
      try {
        await deleteHospital(id).unwrap();
        refetch();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete hospital.');
      }
    }
  };

  const divisionsList = useMemo(() => {
    const set = new Set<string>();
    hospitals.forEach(h => {
      if (h.division) set.add(h.division);
    });
    return Array.from(set);
  }, [hospitals]);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(h => {
      if (selectedDivision !== 'ALL' && h.division !== selectedDivision)
        return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = h.name.toLowerCase();
        const district = h.district.toLowerCase();
        const hotline = h.hotline.toLowerCase();
        if (
          !name.includes(q) &&
          !district.includes(q) &&
          !hotline.includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [hospitals, selectedDivision, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>Emergency Antivenom Hospitals Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Maintain GPS coordinates, 24/7 hotline numbers, and real-time
            polyvalent antivenom stock status.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hospital</span>
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
            placeholder="Search by hospital name, district, or hotline number..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border-subtle bg-bg-surface text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        {divisionsList.length > 0 && (
          <select
            value={selectedDivision}
            onChange={e => setSelectedDivision(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border-subtle bg-bg-surface text-text-primary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="ALL">All Divisions ({hospitals.length})</option>
            {divisionsList.map(div => (
              <option key={div} value={div}>
                {div}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Data Table */}
      <div className="rounded-3xl bg-bg-surface border border-border-subtle shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center gap-2 text-text-muted text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
            <span>Loading hospital directory...</span>
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-xs">
            No emergency medical centers matched your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-subtle text-text-secondary uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-4">Facility Name & Ward</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">24/7 Hotline</th>
                  <th className="p-4">Antivenom & ICU</th>
                  <th className="p-4">GPS Coordinates</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredHospitals.map(h => (
                  <tr key={h.id} className="hover:bg-bg-subtle/50 transition">
                    <td className="p-4">
                      <div className="font-extrabold text-sm text-text-primary">
                        {h.name}
                      </div>
                      <div className="text-xs text-text-muted">
                        {h.emergencyUnit || h.address}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-text-primary">
                        {h.district}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {h.division}, {h.country}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-brand-primary">
                      <a
                        href={`tel:${h.hotline}`}
                        className="hover:underline flex items-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{h.hotline}</span>
                      </a>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            h.hasAntivenomStock
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/15 text-red-600 border border-red-500/20'
                          }`}
                        >
                          {h.hasAntivenomStock ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          <span>
                            {h.hasAntivenomStock
                              ? 'ASV In Stock'
                              : 'Stock Exhausted'}
                          </span>
                        </span>
                        {h.icuAvailable && (
                          <span className="text-[10px] text-text-muted font-medium">
                            ICU Available
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <a
                        href={`https://www.google.com/maps?q=${h.latitude},${h.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-brand-primary hover:underline"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>
                          {h.latitude.toFixed(3)}, {h.longitude.toFixed(3)}
                        </span>
                      </a>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(h)}
                          className="p-2 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 transition cursor-pointer"
                          title="Edit Hospital"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(h.id, h.name)}
                          className="p-2 rounded-lg text-text-secondary hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition cursor-pointer"
                          title="Delete Hospital"
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
                  {editingHospital
                    ? 'Edit Hospital Details'
                    : 'Register Emergency Hospital'}
                </h3>
                <p className="text-xs text-text-secondary">
                  Specify facility contact and geolocation coordinates for
                  nearest-hospital routing.
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
              <div className="space-y-1">
                <label className="font-bold text-text-primary">
                  Hospital / Medical Center Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Dhaka Medical College & Hospital"
                  className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Country Code
                  </label>
                  <select
                    value={formCountry}
                    onChange={e => setFormCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  >
                    <option value="BD">Bangladesh (BD)</option>
                    <option value="IN">India (IN)</option>
                    <option value="PK">Pakistan (PK)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Division / State
                  </label>
                  <input
                    type="text"
                    required
                    value={formDivision}
                    onChange={e => setFormDivision(e.target.value)}
                    placeholder="Dhaka"
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    District
                  </label>
                  <input
                    type="text"
                    required
                    value={formDistrict}
                    onChange={e => setFormDistrict(e.target.value)}
                    placeholder="Dhaka"
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    24/7 Hotline Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formHotline}
                    onChange={e => setFormHotline(e.target.value)}
                    placeholder="+880255165088"
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    Emergency Unit / Ward
                  </label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={e => setFormUnit(e.target.value)}
                    placeholder="Toxicology & Snakebite Ward"
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-primary">
                  Full Physical Address
                </label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={e => setFormAddress(e.target.value)}
                  placeholder="Secretariat Road, Ramna, Dhaka 1000"
                  className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    GPS Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formLatitude}
                    onChange={e => setFormLatitude(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-primary">
                    GPS Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formLongitude}
                    onChange={e => setFormLongitude(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-border-subtle bg-bg-canvas text-text-primary font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 rounded-xl bg-bg-subtle border border-border-subtle">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formHasAsv}
                    onChange={e => setFormHasAsv(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-primary"
                  />
                  <span className="font-bold text-text-primary">
                    Polyvalent Antivenom In Stock
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIcu}
                    onChange={e => setFormIcu(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-primary"
                  />
                  <span className="font-bold text-text-primary">
                    ICU Facilities Available
                  </span>
                </label>
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
                      {editingHospital
                        ? 'Update Hospital'
                        : 'Register Hospital'}
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
