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
          <!-- Content for the left section -->
          <h2>TREE Section</h2>
          <!-- <pre>{{ jsonData | json }} </pre> -->

          <input type="text" (input)="filterTree($event)" placeholder="Search project..." />
          <p-tree
            *ngIf="treeData"
            (nodeSelect)="onProjectSelect($event)"
            (nodeExpand)="onNodeExpand($event)"
            [value]="treeData"
            class="w-full md:w-30rem"
          >
          </p-tree>
        </div>

        <!-- Right Section (50% width) -->
        <div class="col-md-6 right-section">
          <!-- Right Subsections (33% height) -->
          <div class="right-subsection">
            <h3>Lista progetto</h3>
            <!-- Content for subsection 1 -->
          </div>
          <div class="right-subsection">
            <h3>lista moduli</h3>
            <!-- Content for subsection 2 -->
          </div>
          <div class="right-subsection">
            <h3>Lista errori</h3>
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
  `,
  styles: [
    `
      /* Custom CSS for layout */
      .container-fluid {
        padding: 0;
      }

      .left-section,
      .right-section {
        height: 100vh;
      }

      .right-section {
        background-color: #f0f0f0;
      }

      .right-subsection {
        height: 33.33%;
        border: 1px solid #ccc;
        padding: 10px;
      }

      /* Adjust styles for smaller screens */
      @media (max-width: 768px) {
        .left-section,
        .right-section {
          height: auto;
        }

        .right-subsection {
          height: auto;
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

  constructor(private depsRetrieverService: DepsRetrieverService, private cd: ChangeDetectorRef) {
    true;
  }

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

  onProjectSelect(event: any): void {
    console.log('Node clicked:', event.node);
    let selectedProjectName: string;

    if (event.node.data === 'PROGETTI') {
      // Check if the selected node represents a project
      selectedProjectName = event.node.label;
    } else {
      // Assume you're somewhere in the children hierarchy. You'd need to traverse up to get to the root project node
      let currentNode = event.node;
      while (currentNode.data !== 'PROGETTI' && currentNode.parent) {
        currentNode = currentNode.parent;
      }
      selectedProjectName = currentNode.label;
    }

    const correspondingProject: JsonRoot | undefined = this.jsonData?.find(proj => proj.name === selectedProjectName);
    if (correspondingProject) {
      this.selectedErrors = correspondingProject.errors;
      console.log('Selected Project Errors:', this.selectedErrors);
    }
  }

  onNodeClickedTest(event: any): void {
    console.log('Tree clicked');
  }

  onNodeExpand(event: any): void {
    console.log('Node expanded:', event.node);
  }
  onButtonClick(): void {
    console.log('Button was clicked');
  }
}
