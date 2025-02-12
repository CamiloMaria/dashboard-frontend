export const SHOPS = ['PL08', 'PL10', 'PL16', 'CD01'] as const;

export type Shop = typeof SHOPS[number]; 