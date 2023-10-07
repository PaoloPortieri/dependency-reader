// STRUTTURA JSON INPUT

export type JsonRootArray = JsonRoot[]

export interface JsonRoot {
  name: string
  groupId: string
  artifactId: string
  version: string
  scope: number
  dependencies: string[]
  modules: Module[]
  errors: Error[]
}

export interface Module {
  artifactId: string
  dependencies: string[]
}

export interface Error {
  severity: number
  message: string
}


// STRUTTURA NODE PER WIDGET TREE PRIMENG
// https://stackblitz.com/run?file=src%2Fservice%2Fnodeservice.ts
// https://primeng.org/tree#controlled

export interface TreePrimeNg {
  key: string;
  label: string;
  data: string;
  icon: string;
  children?: TreePrimeNg[];
}

export interface ProjectInfo {
  name: string;
  groupId: string;
  artifactId: string;
  version: string;
  scope: number;
}
