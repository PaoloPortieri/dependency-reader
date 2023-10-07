export type Root = Root2[];

export interface Root2 {
  name: string;
  groupId: string;
  artifactId: string;
  version: string;
  scope: number;
  dependencies: string[];
  modules: Module[];
  errors: Error[];
}

export interface Module {
  artifactId: string;
  dependencies: string[];
}

export interface Error {
  severity: number;
  message: string;
}
