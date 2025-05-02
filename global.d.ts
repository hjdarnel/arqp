declare module 'react-simple-snackbar';
declare module 'cabrillo' {
  export function cabrilloToObject(
    cabrillo: string,
    options?: { contest?: string },
  ): Record<PropertyKey, unknown>;
}
