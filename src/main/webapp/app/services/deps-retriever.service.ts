/* eslint-disable curly */
/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { HttpClient } from '@angular/common/http';
import { JsonRoot, JsonRootArray, Module, ProjectError, ProjectInfo, TreePrimeNg } from 'app/entities/dep-reader/deps.model';

@Injectable({ providedIn: 'root' })
export class DepsRetrieverService {
  jsonData!: JsonRootArray;
  constructor(private http: HttpClient) {}

  load(): Observable<any> {
    return this.http.get('content/data/deps.json');
    // fetch data from the spring boot wrapper like this:
    // return this.http.get('http://localhost:8080/getDependencyAnalysis');
  }

  convertJsonRootArrayToPrimeNgTree(input?: JsonRootArray): TreePrimeNg[] | null {
    if (!input) return null;

    let projectNodeList: TreePrimeNg[] = [];

    input.forEach((proj, ind_proj) => {
      let moduleNodeList: TreePrimeNg[] = [];
      const projNode = this.createProjPrimeNgNode(proj, ind_proj);

      (proj.modules ?? []).forEach((module, ind_module) => {
        const moduleNode = this.createModulePrimeNgNode(module, ind_proj, ind_module);
        let moduleDepsNodeList: TreePrimeNg[] = [];
        (module.dependencies ?? []).forEach((deps, ind_deps) => {
          const depNode = this.createDepPrimeNgNode(deps, ind_proj, ind_module, ind_deps);
          moduleDepsNodeList = [...moduleDepsNodeList, depNode];
        });

        // attach moduleDepsNodeList to moduleNode
        moduleNode.children = moduleDepsNodeList;
        moduleNodeList = [...moduleNodeList, moduleNode];
      });
      // attach moduleNodes to projNode
      projNode.children = moduleNodeList;
      projectNodeList = [...projectNodeList, projNode];
    });

    return projectNodeList;
  }

  extractProjectList(input?: JsonRoot[]): ProjectInfo[] {
    return (
      input?.map(el => ({ name: el.name, groupId: el.groupId, artifactId: el.artifactId, version: el.version, scope: el.scope })) ?? []
    );
  }

  createDepPrimeNgNode(dep: string, ind_proj: number, ind_module: number, ind_deps: number): TreePrimeNg {
    return {
      key: `${ind_proj}-${ind_module}-${ind_deps}`,
      label: dep,
      data: 'DIPENDENZE',
      icon: 'pi pi-fw pi-th-large',
    };
  }

  createProjPrimeNgNode(proj: ProjectInfo, ind_proj: number): TreePrimeNg {
    return {
      key: `${ind_proj}`,
      label: proj.name,
      data: 'PROGETTI',
      icon: 'pi pi-fw pi-server',
    };
  }
  createModulePrimeNgNode(module: Module, ind_proj: number, ind_module: number): TreePrimeNg {
    return {
      key: `${ind_proj}-${ind_module}`,
      label: module.artifactId,
      data: 'MODULI',
      icon: 'pi pi-fw pi-box',
    };
  }
  createErrorPrimeNgNode(error: ProjectError, ind_proj: number, ind_errs: number): TreePrimeNg {
    return {
      key: `${ind_proj}-${ind_errs}`,
      label: error.message,
      data: 'ERRORI',
      icon: 'pi pi-fw pi-exclamation-triangle',
    };
  }
}
