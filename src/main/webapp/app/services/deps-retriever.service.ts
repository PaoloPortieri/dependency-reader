/* eslint-disable curly */
/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { HttpClient } from '@angular/common/http';
import { JsonRoot, JsonRootArray, Module, Error, ProjectInfo, TreePrimeNg } from 'app/entities/dep-reader/deps.model';


@Injectable({ providedIn: 'root' })
export class DepsRetrieverService {
  jsonData!: JsonRootArray;
  constructor(private http: HttpClient) {

  }

  load(): Observable<any> {
    return this.http.get("content/data/deps.json");
  }

  convertJsonRootArrayToPrimeNgTree(input?: JsonRootArray): TreePrimeNg[] | null {
    if (!input) return null;

    let projectNodeList: TreePrimeNg[] = [];




    input.forEach((proj, ind_proj) => {

      let moduleNodeList: TreePrimeNg[] = [];

      console.log("🚀 ~ proj:", proj);
      const projNode = this.createProjPrimeNgNode(proj, ind_proj);

      (proj.modules ?? []).forEach((module, ind_module) => {

        console.log("🚀 ~ module:", module);
        const moduleNode = this.createModulePrimeNgNode(module, ind_proj, ind_module);
        let moduleDepsNodeList: TreePrimeNg[] = [];
        (module.dependencies ?? []).forEach((deps, ind_deps) => {

          console.log("🚀 ~ deps:", deps);
          const depNode = this.createDepPrimeNgNode(deps, ind_proj, ind_module, ind_deps);

          moduleDepsNodeList = [...moduleDepsNodeList, depNode];
        })

        // attach moduleDepsNodeList to moduleNode
        moduleNode.children = moduleDepsNodeList;

        moduleNodeList = [...moduleNodeList, moduleNode];

      })
      // attach moduleNodes to projNode
      projNode.children = moduleNodeList;
      let errorsNodeList: TreePrimeNg[] = [];

      (proj.errors ?? []).forEach((error, ind_errs) => {
        console.log("🚀 ~ error:", error);
        const errNode = this.createErrorPrimeNgNode(error, ind_proj, ind_errs);

        errorsNodeList = [...errorsNodeList, errNode];
      })

      // attach errorNodes to pojNode
      projNode.children = [...projNode.children, ...errorsNodeList];

      projectNodeList = [...projectNodeList, projNode];
    });

    return projectNodeList;
  }

  extractProjectList(input?: JsonRoot[]): ProjectInfo[] {
    return input?.map(el => ({ name: el.name, groupId: el.groupId, artifactId: el.artifactId, version: el.version, scope: el.scope })) ?? [];
  }

  createDepPrimeNgNode(dep: string, ind_proj: number, ind_module: number, ind_deps: number): TreePrimeNg {
    return {
      key: `${ind_proj}-${ind_module}-${ind_deps}`,
      label: dep,
      data: 'DIPENDENZE',
      icon: 'pi pi-fw pi-th-large'
    }
  }

  createProjPrimeNgNode(proj: ProjectInfo, ind_proj: number): TreePrimeNg {
    return {
      key: `${ind_proj}`,
      label: proj.name,
      data: 'PROGETTI',
      icon: 'pi pi-fw pi-server'
    }

  }
  createModulePrimeNgNode(module: Module, ind_proj: number, ind_module: number): TreePrimeNg {
    return {
      key: `${ind_proj}-${ind_module}`,
      label: module.artifactId,
      data: 'MODULI',
      icon: 'pi pi-fw pi-box'
    }
  }
  createErrorPrimeNgNode(error: Error, ind_proj: number, ind_errs: number): TreePrimeNg {
    return {
      key: `${ind_proj}-${ind_errs}`,
      label: error.message,
      data: 'ERRORI',
      icon: 'pi pi-fw pi-exclamation-triangle'
    }
  }
}



/*
proj -> deps
proj -> module -> deps
proj -> errors
{
  key: '0',
  label: 'Project Name',  // nome progetto
  data: 'PROGETTI',
  icon: 'pi pi-fw pi-inbox',
  children: [{
    key: '0-0',
    label: 'Module Artifcact ID',  // nome modulo
    data: 'MODULI',
    icon: 'pi pi-fw pi-inbox',

    children: [{
      key: '0-0-0',
      label: 'Dependency artifact ID',  // nome dipendenza
      data: 'DIPENDENZE',
      icon: 'pi pi-fw pi-inbox',
    },
    {
      key: '0-0-1',
      label: 'Dependency artifact 2',  // nome dipendenza
      data: 'DIPENDENZE',
      icon: 'pi pi-fw pi-inbox',
    }]
    }
  ]
      {

        */
/*

[
  {
    "name": "Project Name",
    "groupId": "Group ID",
    "artifactId": "Artifact ID",
    "version": "version",
    "scope": 0,
    "dependencies": ["Dependency artifact ID", "Dependency artifact ID", "..."],
    "modules": [
      {
        "artifactId": "Module Artifcact ID",
        "dependencies": ["Dependency artifact ID", "Dependency artifact ID", "..."]
      }
    ],
    "errors": [
      {
        "severity": 1,
        "message": "Error Message"
      }
    ]
  }
]

Severity codes:
    1 - Warning (Versioni delle librerie (specialmente terze parti) non coerenti tra i progetti)
    2 - Error (Dipendenze circolari)
    3 - Fatal Error (Il progetto è dipendente da progetti che in ordine di scope vengono compilati in seguito)

*/
