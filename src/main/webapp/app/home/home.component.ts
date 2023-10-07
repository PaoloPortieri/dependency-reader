import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


/*
export class AppComponent {
  // visualizzatore json

  // TODO crea filtro Error Severity con tendina "Error, Warning, Info"
  // che parsa gli errors di quel tipo e li mappa in una lista

  json: Root = JSON.parse(`
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
  `);

  get code(): string {
    return JSON.stringify(this.json, null, 2);
  }

  set code(v) {
    try {
      this.json = JSON.parse(v);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error occored while you were typing the JSON');
    }
  }
}
*/
