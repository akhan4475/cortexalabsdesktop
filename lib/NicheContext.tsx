import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NicheId, NICHE_IDS } from './niches';

interface NicheContextValue {
  activeNiche: NicheId;
  setActiveNiche: (niche: NicheId) => void;
}

const NicheContext = createContext<NicheContextValue>({
  activeNiche: 'pool',
  setActiveNiche: () => {},
});

const STORAGE_KEY = 'cortexa_active_niche';

function resolveNiche(value: unknown): NicheId {
  if (typeof value === 'string' && NICHE_IDS.includes(value as NicheId)) {
    return value as NicheId;
  }
  return 'pool';
}

export function NicheProvider({ children }: { children: ReactNode }) {
  const [activeNiche, setActiveNicheState] = useState<NicheId>(() => {
    try {
      return resolveNiche(localStorage.getItem(STORAGE_KEY));
    } catch {
      return 'pool';
    }
  });

  const setActiveNiche = (niche: NicheId) => {
    setActiveNicheState(niche);
    try { localStorage.setItem(STORAGE_KEY, niche); } catch {}
  };

  return (
    <NicheContext.Provider value={{ activeNiche, setActiveNiche }}>
      {children}
    </NicheContext.Provider>
  );
}

export function useNiche() {
  return useContext(NicheContext);
}
