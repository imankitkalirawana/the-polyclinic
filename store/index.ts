/**
 * Store Module
 *
 * Central export point for all Zustand stores and their related utilities.
 * This module provides a unified interface for state management across the application.
 *
 * @example
 * ```tsx
 * // Import cache utilities
 * import {
 *   useCollectionQuery,
 *   useSelectedPatient,
 *   usePatientById,
 * } from '@/store';
 *
 * // Use in components
 * function MyComponent() {
 *   const patient = useSelectedPatient();
 *   const cachedPatient = usePatientById(patientId);
 *
 *   return <div>{patient?.name}</div>;
 * }
 * ```
 */

// ============================================================================
// CACHE MODULE
// ============================================================================
// Provides React Query + Zustand integration for automatic caching

export * from './cache';
