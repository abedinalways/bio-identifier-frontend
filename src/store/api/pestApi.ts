import { baseApi } from './baseApi';
import type { IPest, IIdentificationResult } from '../../core/interfaces';
import type { CropType } from '../../core/types';
import { MOCK_PESTS } from '../../core/data/mockData';
import {
  adaptPrismaPest,
  adaptIdentificationResult,
} from '../../core/adapters/speciesAdapter';

export interface IDosageCalculationRequest {
  pestId?: string;
  treatmentId?: string;
  activeIngredient?: string;
  dosagePerLiter?: number;
  dosageUnit?: 'ml' | 'g';
  waterVolumeLiters?: number;
  waterLiters?: number;
  sprayerTankLiters?: number;
}

export interface IDosageCalculationResponse {
  activeIngredient: string;
  waterVolumeLiters: number;
  dosagePerLiter: number;
  dosageUnit: string;
  requiredConcentrate: number;
  sprayerTankCapacityLiters?: number;
  numberOfTanksRequired?: number;
  concentratePerTank?: number;
  instructions: string;
  safetyGuidance: string;
}

export const pestApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    identifyPest: builder.mutation<IIdentificationResult, FormData>({
      queryFn: async formData => {
        try {
          if (!formData.has('domain')) {
            formData.append('domain', 'pest');
          }

          const response = await fetch('/api/v1/identify/analyze', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const raw = await response.json();
            const adapted = adaptIdentificationResult(raw.data || raw);
            return { data: adapted };
          }
          console.warn(
            'Pest identify API returned non-OK status:',
            response.status,
          );
        } catch (err) {
          console.warn(
            'Backend pest identification unreachable, using fallback:',
            err,
          );
        }

        const cropType = (formData.get('cropType') as string) || 'mango';
        const matchedPest =
          MOCK_PESTS.find(p =>
            p.damageProfile.affectedCrops.includes(cropType as CropType),
          ) || MOCK_PESTS[0];

        const result: IIdentificationResult = {
          id: `pest-ident-${Date.now()}`,
          type: 'pest',
          confidence: 0.92,
          analyzedAt: new Date().toISOString(),
          pestData: matchedPest,
          alternativeMatches: [
            { name: MOCK_PESTS[1].commonName.en, confidence: 0.05 },
            { name: MOCK_PESTS[2].commonName.en, confidence: 0.03 },
          ],
        };

        return { data: result };
      },
      invalidatesTags: ['Pests'],
    }),

    getPestById: builder.query<IPest, string>({
      queryFn: async id => {
        try {
          const res = await fetch(`/api/v1/pests/${id}`);
          if (res.ok) {
            const json = await res.json();
            const raw = json.data || json;
            return { data: adaptPrismaPest(raw) };
          }
        } catch (err) {
          console.warn(`Failed to fetch pest '${id}', using fallback:`, err);
        }
        const found = MOCK_PESTS.find(p => p.id === id) || MOCK_PESTS[0];
        return { data: found };
      },
      providesTags: (_res, _err, id) => [{ type: 'Pests', id }],
    }),

    getPestsList: builder.query<
      IPest[],
      {
        category?: string;
        crop?: string;
        severity?: string;
        search?: string;
      } | void
    >({
      queryFn: async query => {
        try {
          const params = new URLSearchParams();
          if (query) {
            if (query.category) params.set('category', query.category);
            if (query.crop) params.set('crop', query.crop);
            if (query.severity) params.set('severity', query.severity);
            if (query.search) params.set('search', query.search);
          }
          const qs = params.toString() ? `?${params.toString()}` : '';

          const res = await fetch(`/api/v1/pests${qs}`);
          if (res.ok) {
            const json = await res.json();
            const rawData = json.data || json;
            const items = Array.isArray(rawData)
              ? rawData
              : rawData.items || [];
            if (Array.isArray(items) && items.length > 0) {
              return { data: items.map(adaptPrismaPest) };
            }
          }
        } catch (err) {
          console.warn(
            'Failed to fetch pests from API, falling back to mock dataset:',
            err,
          );
        }
        return { data: MOCK_PESTS };
      },
      providesTags: ['Pests'],
    }),

    calculateDosage: builder.mutation<
      IDosageCalculationResponse,
      IDosageCalculationRequest
    >({
      queryFn: async req => {
        try {
          if (req.pestId && req.treatmentId) {
            const res = await fetch('/api/v1/pests/calculate-dosage', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pestId: req.pestId,
                treatmentId: req.treatmentId,
                waterLiters: req.waterLiters || req.waterVolumeLiters || 16,
              }),
            });
            if (res.ok) {
              const json = await res.json();
              const payload = json.data || json;
              return {
                data: {
                  activeIngredient:
                    payload.treatment?.activeIngredient ||
                    req.activeIngredient ||
                    'Treatment',
                  waterVolumeLiters:
                    payload.calculation?.waterVolumeLiters || 16,
                  dosagePerLiter: payload.treatment?.dosagePerLiter || 0.4,
                  dosageUnit: payload.calculation?.dosageUnit || 'ml',
                  requiredConcentrate:
                    payload.calculation?.totalRequiredChemical || 0,
                  sprayerTankCapacityLiters: 16,
                  numberOfTanksRequired:
                    payload.calculation?.standardKnapsackTanks || 1,
                  concentratePerTank:
                    payload.calculation?.dosagePer16LTank || 0,
                  instructions:
                    payload.calculation?.instructionsSummary ||
                    'Mix thoroughly.',
                  safetyGuidance:
                    payload.treatment?.safetyInstructions ||
                    'Wear standard PPE.',
                },
              };
            }
          }
        } catch (err) {
          console.warn(
            'Failed to call backend dosage calculation API, calculating locally:',
            err,
          );
        }

        // Local calculation
        const waterLiters = req.waterVolumeLiters || req.waterLiters || 16;
        const dose = req.dosagePerLiter || 0.4;
        const unit = req.dosageUnit || 'ml';
        const requiredConcentrate = +(waterLiters * dose).toFixed(2);
        const sprayerTankCapacityLiters = req.sprayerTankLiters || 16;
        const numberOfTanksRequired = Math.ceil(
          waterLiters / sprayerTankCapacityLiters,
        );
        const concentratePerTank = +(sprayerTankCapacityLiters * dose).toFixed(
          2,
        );

        return {
          data: {
            activeIngredient:
              req.activeIngredient || 'Agrochemical Concentrate',
            waterVolumeLiters: waterLiters,
            dosagePerLiter: dose,
            dosageUnit: unit,
            requiredConcentrate,
            sprayerTankCapacityLiters,
            numberOfTanksRequired,
            concentratePerTank,
            instructions: `Mix ${concentratePerTank}${unit} of agrochemical per each ${sprayerTankCapacityLiters}L sprayer tank.`,
            safetyGuidance:
              'Wear protective mask, nitrile gloves, and spray in the early morning.',
          },
        };
      },
    }),
  }),
});

export const {
  useIdentifyPestMutation,
  useGetPestByIdQuery,
  useGetPestsListQuery,
  useCalculateDosageMutation,
} = pestApi;
