/* eslint-disable curly */
/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { HttpClient } from '@angular/common/http';
import { JsonRoot, JsonRootArray, ProjectInfo, TreePrimeNg } from 'app/entities/dep-reader/deps.model';


@Injectable({ providedIn: 'root' })
export class DepsRetrieverService {
  jsonData!: JsonRootArray;
  constructor(private http: HttpClient) {

  }

  load(): Observable<any> {
    return this.http.get("assets/data/deps.json");
  }

  convertJsonRootArrayToPrimeNgTree(input?: JsonRootArray): TreePrimeNg | null {
    if (!input) return null;


    return null;
  }

  extractProjectList(input?: JsonRoot[]): ProjectInfo[] {
    return input?.map(el => ({ name: el.name, groupId: el.groupId, artifactId: el.artifactId, version: el.version, scope: el.scope })) ?? [];
  }
}



/*
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
