import { ProjectError } from 'app/entities/dep-reader/deps.model';

export type Root = Root2[];

export interface Root2 {
  name: string;
  groupId: string;
  artifactId: string;
  version: string;
  scope: number;
  dependencies: string[];
  modules: Module[];
  errors: ProjectError[];
}

export interface Module {
  artifactId: string;
  dependencies: string[];
}

export interface Error {
  severity: number;
  message: string;
}
