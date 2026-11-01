import { useState, useEffect, useCallback } from 'react';
import { InstitutionIdentity } from '../types';
import { initialInstitutionIdentity } from '../data/systemConfigData';

const STORAGE_KEY = 'simkeu_institution_identity';
const EVENT_NAME = 'simkeu-institution-identity-updated';

/**
 * Retrieve institution identity from localStorage or fallback to initial defaults
 */
export function getStoredInstitutionIdentity(): InstitutionIdentity {
  if (typeof window === 'undefined') {
    return initialInstitutionIdentity;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.shortName === 'PMRM') {
        parsed.shortName = 'Raudhatussalam';
      }
      return {
        ...initialInstitutionIdentity,
        ...parsed,
      };
    }
  } catch (err) {
    console.error('Error reading institution identity from localStorage:', err);
  }
  return initialInstitutionIdentity;
}

/**
 * Save institution identity to localStorage and notify all listeners
 */
export function saveStoredInstitutionIdentity(identity: InstitutionIdentity): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, {
        detail: identity,
      })
    );
  } catch (err) {
    console.error('Error saving institution identity to localStorage:', err);
  }
}

/**
 * React hook to access and update institution identity reactively across the entire application
 */
export function useInstitutionIdentity() {
  const [identity, setIdentityState] = useState<InstitutionIdentity>(() =>
    getStoredInstitutionIdentity()
  );

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<InstitutionIdentity>;
      if (customEvent.detail) {
        setIdentityState(customEvent.detail);
      } else {
        setIdentityState(getStoredInstitutionIdentity());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setIdentityState(getStoredInstitutionIdentity());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateIdentity = useCallback((updated: Partial<InstitutionIdentity>) => {
    setIdentityState((prev) => {
      const next = { ...prev, ...updated };
      saveStoredInstitutionIdentity(next);
      return next;
    });
  }, []);

  return { identity, updateIdentity };
}
