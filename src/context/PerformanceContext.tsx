/**
 * Performance Context
 * 
 * Optimized context with selector pattern to prevent unnecessary re-renders
 */

import React, { createContext, useContext, useRef, useCallback, useMemo } from 'react';

type Listener<T> = (state: T) => void;
type Selector<T, R> = (state: T) => R;

/**
 * Create an optimized context with selector pattern
 */
export function createOptimizedContext<T>() {
  const Context = createContext<{
    getState: () => T;
    setState: (state: T | ((prev: T) => T)) => void;
    subscribe: (listener: Listener<T>) => () => void;
  } | null>(null);

  /**
   * Provider component
   */
  function Provider({
    children,
    initialState,
  }: {
    children: React.ReactNode;
    initialState: T;
  }) {
    const stateRef = useRef<T>(initialState);
    const listenersRef = useRef<Set<Listener<T>>>(new Set());

    const getState = useCallback(() => stateRef.current, []);

    const setState = useCallback((newState: T | ((prev: T) => T)) => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(stateRef.current)
        : newState;

      if (nextState !== stateRef.current) {
        stateRef.current = nextState;
        listenersRef.current.forEach((listener) => listener(nextState));
      }
    }, []);

    const subscribe = useCallback((listener: Listener<T>) => {
      listenersRef.current.add(listener);
      return () => {
        listenersRef.current.delete(listener);
      };
    }, []);

    const value = useMemo(
      () => ({
        getState,
        setState,
        subscribe,
      }),
      [getState, setState, subscribe]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  /**
   * Hook to use context with selector
   */
  function useSelector<R>(
    selector: Selector<T, R>,
    equalityFn: (a: R, b: R) => boolean = Object.is
  ): R {
    const contextValue = useContext(Context);

    if (!contextValue) {
      throw new Error('useSelector must be used within Provider');
    }

    const { getState, subscribe } = contextValue;

    const selectedStateRef = useRef<R>(selector(getState()));
    const [, forceRender] = React.useReducer((s) => s + 1, 0);

    React.useEffect(() => {
      const checkForUpdates = (state: T) => {
        const newSelectedState = selector(state);
        if (!equalityFn(selectedStateRef.current, newSelectedState)) {
          selectedStateRef.current = newSelectedState;
          forceRender();
        }
      };

      return subscribe(checkForUpdates);
    }, [subscribe, selector, equalityFn]);

    return selectedStateRef.current;
  }

  /**
   * Hook to get setState function
   */
  function useSetState(): (state: T | ((prev: T) => T)) => void {
    const contextValue = useContext(Context);

    if (!contextValue) {
      throw new Error('useSetState must be used within Provider');
    }

    return contextValue.setState;
  }

  /**
   * Hook to get full state (use sparingly)
   */
  function useState(): [T, (state: T | ((prev: T) => T)) => void] {
    const contextValue = useContext(Context);

    if (!contextValue) {
      throw new Error('useState must be used within Provider');
    }

    const state = useSelector((s) => s);
    return [state, contextValue.setState];
  }

  return {
    Provider,
    useSelector,
    useSetState,
    useState,
  };
}

/**
 * Example: Station Context with optimized selectors
 */
interface StationState {
  stations: any[];
  selectedStationId: number | null;
  filters: {
    fuelType?: string;
    maxDistance?: number;
  };
  loading: boolean;
}

const StationContext = createOptimizedContext<StationState>();

export const StationProvider = StationContext.Provider;

// Optimized selectors - only re-render when specific data changes
export const useStations = () => 
  StationContext.useSelector((state) => state.stations);

export const useSelectedStationId = () =>
  StationContext.useSelector((state) => state.selectedStationId);

export const useStationFilters = () =>
  StationContext.useSelector((state) => state.filters);

export const useStationLoading = () =>
  StationContext.useSelector((state) => state.loading);

export const useSetStationState = StationContext.useSetState;

/**
 * Shallow equality comparison for objects
 */
export function shallowEqual<T extends Record<string, any>>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(b, keysA[i]) || !Object.is(a[keysA[i]], b[keysA[i]])) {
      return false;
    }
  }

  return true;
}

