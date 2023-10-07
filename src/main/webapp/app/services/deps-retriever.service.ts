/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { HttpClient } from '@angular/common/http';
import { JsonRootArray } from 'app/entities/dep-reader/deps.model';


@Injectable({ providedIn: 'root' })
export class DepsRetrieverService {
  jsonData!: JsonRootArray;
  constructor(private http: HttpClient) { }

  load(): void {
    this.http.get("assets/data/deps.json").subscribe((data: any) => {

      console.log("caricamento json:", data);
      this.jsonData = data;
    });
  }
}

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
