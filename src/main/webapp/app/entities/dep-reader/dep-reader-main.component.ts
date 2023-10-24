/* eslint-disable no-console */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DepsRetrieverService } from 'app/services/deps-retriever.service';
import { JsonRoot, JsonRootArray, ProjectError, TreePrimeNg } from './deps.model';

@Component({
  template: `
    <div class="container-fluid">
      <div class="row">
        <!-- Left Section (50% width) -->
        <div class="col-md-6 left-section">
          <input type="text" (input)="filterTree($event)" placeholder="Search project..." />
          <p-tree
            *ngIf="treeData"
            selectionMode="single"
            (onNodeSelect)="onNodeSelect($event)"
            (onNodeExpand)="onNodeExpand($event)"
            [value]="treeData"
            class="w-full md:w-30rem"
          ></p-tree>
        </div>

        <div class="col-md-6 right-section">
          <!-- Lista progetto -->
          <div class="right-subsection">
            <h3 class="sticky-header">
              <span>
                {{ selectedProject?.name }}
                <ng-container *ngIf="selectedProject">-</ng-container>
                Project details
              </span>
            </h3>
            <div class="scrollable-content">
              <div class="content-wrapper">
                <ul *ngIf="selectedProject; else noProject">
                  <li>Name: {{ selectedProject.name }}</li>
                  <li>Group ID: {{ selectedProject.groupId }}</li>
                  <li>Artifact ID: {{ selectedProject.artifactId }}</li>
                  <li>Version: {{ selectedProject.version }}</li>
                  <li>Scope: {{ selectedProject.scope }}</li>
                  <li>Error Count: {{ selectedProject.errors?.length || 0 }}</li>
                  <li>
                    Dependencies:
                    <ul>
                      <li *ngFor="let dependency of selectedProject.dependencies">{{ dependency }}</li>
                    </ul>
                  </li>
                </ul>
                <ng-template #noProject>
                  <p>Select a project to view details.</p>
                </ng-template>
              </div>
            </div>
          </div>

          <!-- lista moduli -->
          <div class="right-subsection">
            <h3 class="sticky-header">Submodules</h3>
            <div class="scrollable-content">
              <div class="content-wrapper">
                <ul *ngIf="selectedProject && selectedProject.modules; else noModules">
                  <li *ngFor="let module of selectedProject.modules">
                    {{ module.artifactId }}
                    <div *ngIf="module.dependencies && module.dependencies.length">
                      <strong>Dependencies:</strong>
                      <ul>
                        <li *ngFor="let dependency of module.dependencies">{{ dependency }}</li>
                      </ul>
                    </div>
                  </li>
                </ul>
                <ng-template #noModules>
                  <p>No modules for the selected project.</p>
                </ng-template>
              </div>
            </div>
          </div>

          <div class="right-subsection">
            <h3 class="sticky-header">Errors</h3>
            <div class="scrollable-content">
              <div class="content-wrapper">
                <ul *ngIf="selectedErrors; else noErrors">
                  <li *ngFor="let error of selectedErrors">{{ error.message }}</li>
                </ul>
                <ng-template #noErrors>
                  <p>No errors for selected project.</p>
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Custom CSS for layout */
      .container-fluid {
        padding: 0;
      }

      .right-section {
        background-color: #f0f0f0;
        display: flex;
        flex-direction: column;
        height: 100vh;
      }

      .right-subsection {
        background-color: #e0e0e0;
        border: 1px solid #ccc;
        flex: 1; /* Equally distribute space between right-subsections */
        height: calc(33.33vh - 42px);
        position: relative; /* Necessary for sticky positioning of headers */
      }

      .scrollable-content {
        height: calc(100% - 40px);
        overflow-y: auto;
        padding: 10px;
      }

      @media (max-width: 768px) {
        .left-section,
        .right-section {
          height: auto;
        }

        .content-wrapper {
          padding: 10px;
        }

        .sticky-header {
          background-color: #f0f0f0;
          z-index: 2;
          position: sticky;
          top: 0;
          padding: 10px;
        }
      }
    `,
  ],
})
export class DepReaderMainComponent implements OnInit {
  jsonData?: JsonRootArray;
  treeData: TreePrimeNg[] | null = null;
  selectedNode!: TreePrimeNg;
  selectedErrors?: ProjectError[];
  selectedProject?: JsonRoot;

  constructor(private depsRetrieverService: DepsRetrieverService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.depsRetrieverService.load().subscribe((data: any) => {
      console.log('caricamento json:', data);
      this.jsonData = data;

      this.treeData = this.depsRetrieverService.convertJsonRootArrayToPrimeNgTree(data);
      console.log('caricamento data tree widget:', this.treeData);

      this.cd.detectChanges();
    });
  }

  filterTree(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;

    if (!this.jsonData || searchTerm.trim() === '') {
      this.treeData = this.depsRetrieverService.convertJsonRootArrayToPrimeNgTree(this.jsonData);
      return;
    }

    const filteredData: JsonRootArray = this.jsonData.filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
    this.treeData = this.depsRetrieverService.convertJsonRootArrayToPrimeNgTree(filteredData);
  }

  onNodeSelect(event: any): void {
    let selectedProjectName: string;

    if (event.node.data === 'PROGETTI') {
      selectedProjectName = event.node.label;
    } else {
      let currentNode = event.node;
      while (currentNode.data !== 'PROGETTI' && currentNode.parent) {
        currentNode = currentNode.parent;
      }
      selectedProjectName = currentNode.label;
    }

    const correspondingProject: JsonRoot | undefined = this.jsonData?.find(proj => proj.name === selectedProjectName);
    if (correspondingProject) {
      this.selectedErrors = correspondingProject.errors;
      this.selectedProject = correspondingProject;
    }
  }

  onNodeExpand(event: any): void {
    console.log('Node expanded:', event.node);
  }
}
