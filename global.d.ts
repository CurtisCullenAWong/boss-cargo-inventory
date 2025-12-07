// globals.d.ts or css.d.ts
declare module '*.css';

// Web platform type declarations
declare global {
  interface Window {
    matchMedia?: (query: string) => MediaQueryList;
  }
  
  interface MediaQueryList {
    matches: boolean;
    media: string;
    addListener?: (listener: (e: MediaQueryListEvent) => void) => void;
    removeListener?: (listener: (e: MediaQueryListEvent) => void) => void;
    addEventListener?: (type: 'change', listener: (e: MediaQueryListEvent) => void) => void;
    removeEventListener?: (type: 'change', listener: (e: MediaQueryListEvent) => void) => void;
  }
  
  interface MediaQueryListEvent {
    matches: boolean;
    media: string;
  }
}