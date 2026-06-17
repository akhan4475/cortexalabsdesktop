export const NICHES = [
  { id: 'pool',          label: 'Pool Services',          short: 'Pool',    color: '#3B82F6' },
  { id: 'roofing',       label: 'Roofing',                short: 'Roof',    color: '#F59E0B' },
  { id: 'landscaping',   label: 'Landscaping',            short: 'Land',    color: '#10B981' },
  { id: 'construction',  label: 'Construction',           short: 'Constr',  color: '#8B5CF6' },
  { id: 'concrete',      label: 'Concrete',               short: 'Conc',    color: '#6B7280' },
  { id: 'trades',        label: 'Trades (HVAC/Plumbing)', short: 'Trades',  color: '#EF4444' },
  { id: 'painters',      label: 'Painters',               short: 'Paint',   color: '#EC4899' },
  { id: 'remodelers',    label: 'Remodelers',             short: 'Remod',   color: '#F97316' },
] as const;

export type NicheId = typeof NICHES[number]['id'];

export function getNiche(id: NicheId) {
  return NICHES.find(n => n.id === id)!;
}

export const NICHE_IDS = NICHES.map(n => n.id);

export const FACTORY_TEMPLATES: Record<NicheId, string[]> = {
  pool:         ['pool-modern',        'pool-luxury',       'pool-family'],
  roofing:      ['roofing-bold',       'roofing-clean',     'roofing-pro'],
  landscaping:  ['landscaping-green',  'landscaping-estate', 'landscaping-modern'],
  construction: ['construction-heavy', 'construction-clean', 'construction-pro'],
  concrete:     ['concrete-industrial','concrete-modern',   'concrete-clean'],
  trades:       ['trades-bold',        'trades-clean',      'trades-pro'],
  painters:     ['painters-bright',    'painters-minimal',  'painters-pro'],
  remodelers:   ['remodelers-luxury',  'remodelers-clean',  'remodelers-modern'],
};

export const FACTORY_STAGES = [
  { id: 'intake',          label: 'Intake',           number: 1  },
  { id: 'research',        label: 'Research',         number: 2  },
  { id: 'seo',             label: 'SEO',              number: 3  },
  { id: 'assets',          label: 'Assets',           number: 4  },
  { id: 'strategy',        label: 'Strategy',         number: 5  },
  { id: 'copy',            label: 'Copy',             number: 6  },
  { id: 'brand_dna',       label: 'Brand DNA',        number: 7  },
  { id: 'brand_resonance', label: 'Brand Resonance',  number: 8  },
  { id: 'hero_image',      label: 'Hero Image',       number: 9  },
  { id: 'build_qa',        label: 'Build + QA',       number: 10 },
  { id: 'deploy',          label: 'Deploy',           number: 11 },
  { id: 'delivery',        label: 'Delivery',         number: 12 },
  { id: 'proposal',        label: 'Proposal',         number: 13 },
] as const;

export const CONTENT_BUCKETS = [
  { id: 'video_ideas',   label: 'Video Ideas',   description: 'Raw content ideas and angles to explore'          },
  { id: 'inspiration',   label: 'Inspiration',   description: 'Reels and posts that performed well in your niche' },
  { id: 'expert_brain',  label: 'Expert Brain',  description: 'Frameworks, methods, and expertise you teach'      },
  { id: 'my_voice',      label: 'My Voice',      description: 'Past captions and writing samples to clone style'  },
  { id: 'context',       label: 'My Business',   description: 'Your offer, niche, avatar, and positioning'        },
  { id: 'instructions',  label: 'Instructions',  description: 'Rules for how Claude should write your content'    },
  { id: 'feedback',      label: 'Feedback',      description: 'Post-mortems from published content performance'   },
] as const;

export type BucketId = typeof CONTENT_BUCKETS[number]['id'];
