export function createMissingDateImplError(provider: string) {
  return Error(
    `SimTimepicker: No provider found for ${provider}. You must import one of the following ` +
      `modules at your application root: SimDateModule, or provide a ` +
      `custom implementation.`
  );
}
