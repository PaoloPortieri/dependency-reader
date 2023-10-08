/* eslint-disable no-console */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DepsRetrieverService } from 'app/services/deps-retriever.service';
import { JsonRootArray, TreePrimeNg } from './deps.model';

@Component({
  template: `
    <div class="container-fluid">
        <div class="row">
            <!-- Left Section (50% width) -->
            <div class="col-md-6 left-section">
                <!-- Content for the left section -->
                <h2>TREE Section</h2>
                <!-- <pre>{{ jsonData | json }} </pre> -->

                <p-tree *ngIf="treeData" [value]="treeData" class="w-full md:w-30rem" ></p-tree>
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
                    <!-- Content for subsection 3 -->
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

        .left-section, .right-section {
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
            .left-section, .right-section {
                height: auto;
            }

            .right-subsection {
                height: auto;
            }
        }


    `
  ]
})
export class DepReaderMainComponent implements OnInit {

  jsonData?: JsonRootArray;
  treeData: TreePrimeNg[] | null = null;
  selectedNode!: TreePrimeNg;
  constructor(private depsRetrieverService: DepsRetrieverService, private cd: ChangeDetectorRef) {
    true
  }

  ngOnInit(): void {
    this.depsRetrieverService.load().subscribe((data: any) => {
      console.log("caricamento json:", data);
      this.jsonData = data;

      this.treeData = this.depsRetrieverService.convertJsonRootArrayToPrimeNgTree(data);
      console.log("caricamento data tree widget:", this.treeData);

      this.cd.detectChanges();
    });
  }

}
