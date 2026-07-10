import { useRef, useCallback } from 'react';
import { materials as allMaterials } from '../loadResources.js';

export function useMaterials() {
  const usedIdsRef = useRef(new Set());

  const remainingCount = allMaterials.length - usedIdsRef.current.size;

  const pickNext = useCallback(() => {
    const remaining = allMaterials.filter(m => !usedIdsRef.current.has(m.id));
    if (remaining.length === 0) return null;
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    usedIdsRef.current = new Set([...usedIdsRef.current, next.id]);
    return next;
  }, []);

  const resetPool = useCallback(() => {
    usedIdsRef.current = new Set();
  }, []);

  const markUsed = useCallback((material) => {
    usedIdsRef.current = new Set([...usedIdsRef.current, material.id]);
  }, []);

  const getRemaining = useCallback(() => {
    return allMaterials.filter(m => !usedIdsRef.current.has(m.id));
  }, []);

  const getRemainingCount = useCallback(() => {
    return allMaterials.length - usedIdsRef.current.size;
  }, []);

  return {
    totalCount: allMaterials.length,
    remainingCount,
    pickNext,
    resetPool,
    markUsed,
    getRemaining,
    getRemainingCount,
  };
}
