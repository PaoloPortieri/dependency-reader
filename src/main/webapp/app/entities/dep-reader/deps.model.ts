// STRUTTURA JSON INPUT

export type JsonRootArray = JsonRoot[]

export interface JsonRoot {
  name: string;
  groupId: string;
  artifactId: string;
  version: string;
  scope: number;
  dependencies?: string[];
  modules?: Module[];
  errors?: Error[];
}

export interface Module {
  artifactId: string;
  dependencies?: string[];
}

export interface Error {
  severity: number;
  message: string;
}


// STRUTTURA NODE PER WIDGET TREE PRIMENG
// https://stackblitz.com/run?file=src%2Fservice%2Fnodeservice.ts
// https://primeng.org/tree#controlled
// https://stackblitz.com/run?file=src%2Fapp%2Fdemo%2Ftree-single-demo.ts,node_modules%2Fprimeng%2Fapi%2Ftreenode.d.ts

export interface TreePrimeNg {
  key: string;
  label: string;
  data: PrimeNgDataType;
  icon: string;
  // expanded?: boolean;
  // parent?: TreePrimeNg;
  children?: TreePrimeNg[];
}

export interface ProjectInfo {
  name: string;
  groupId: string;
  artifactId: string;
  version: string;
  scope: number;
}
export type PrimeNgDataType = 'PROGETTI' | 'MODULI' | 'DIPENDENZE' | 'ERRORI';
