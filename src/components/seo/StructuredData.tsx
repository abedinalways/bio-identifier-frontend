import React from 'react';
import type { ISnake, IPest } from '../../core/interfaces';

export function MedicalWebPageSchema({ snake }: { snake: ISnake }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: `${snake.commonName.en} (${snake.scientificName}) Identification & Antivenom Advisory`,
    description: `Clinical toxicology, antivenom requirements (${snake.venomProfile.antivenomType}), and Golden Hour first aid protocol for ${snake.commonName.en}.`,
    medicalAudience: 'Emergency Medical Responders, Farmers, General Public',
    aspect: ['Diagnosis', 'Treatment', 'Prevention'],
    about: {
      '@type': 'MedicalCondition',
      name: `${snake.commonName.en} Bite Envenomation`,
      possibleTreatment: [
        {
          '@type': 'MedicalTherapy',
          name: snake.venomProfile.antivenomType,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function HowToFirstAidSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Snakebite Golden Hour Medical First Aid Protocol',
    description:
      'Evidence-based first aid steps to manage snakebite envenomation before hospital arrival.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Keep Patient Calm',
        text: 'Keep the patient still and reassure them to slow heart rate and venom distribution.',
      },
      {
        '@type': 'HowToStep',
        name: 'Immobilize Bitten Limb',
        text: 'Immobilize the limb with a rigid splint or broad bandage, exactly like a fractured bone.',
      },
      {
        '@type': 'HowToStep',
        name: 'Remove Constricting Items',
        text: 'Remove rings, watches, tight clothes before swelling occurs.',
      },
      {
        '@type': 'HowToStep',
        name: 'Rapid Hospital Transport',
        text: 'Transport patient immediately to the nearest hospital equipped with polyvalent antivenom.',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PestTaxonSchema({ pest }: { pest: IPest }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Taxon',
    name: pest.scientificName,
    alternateName: pest.commonName.en,
    description: `Agricultural pest affecting ${pest.damageProfile.affectedCrops.join(', ')}. Symptoms: ${pest.damageProfile.symptoms.join('; ')}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
