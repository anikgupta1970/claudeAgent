// Smart component (with built-in state/city data)
export { BranchSelector } from './branch-selector.js';
export type { BranchSelectorProps } from './branch-selector.js';

// Presentational component (for custom data handling)
export { BranchSelectorBase } from './branch-selector-base.js';
export type { BranchSelectorBaseProps, Branch, BranchFilterParams, SelectionMode } from './branch-selector-base.js';

// Data hooks and context
export { BranchesProvider, useBranches, useBranchesOptional } from './use-branches.js';
export type { BranchesContextValue, BranchesProviderProps } from './use-branches.js';

// Location data (for custom implementations)
export { STATES, CITIES, getCitiesForState } from './location-data.js';
export type { StateOption, CityOption } from './location-data.js';
