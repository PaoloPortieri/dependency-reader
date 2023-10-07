import { Component } from '@angular/core';
import { Root } from './app.model';

@Component({
  selector: 'jhi-my-app',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
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
