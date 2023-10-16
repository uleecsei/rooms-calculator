import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, filter, Subject } from 'rxjs';

import { Project } from '../../models/project';
import { SaveDataService } from '../../services/save-data.service';
import { Shelving } from '../../models/shelving';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  projectDetails: Project = {
    shelving: [],
    shelvingNotes: '',
    options: [],
    optionsNotes: '',
    quotation: {
      'Freight Inwards': { sell: 0, cost: 0 },
      'Installation': { sell: 0, cost: 0 },
      'Delivery': { sell: 0, cost: 0 },
      'Total Investment': { sell: 0, cost: 0 },
      'GP': { sell: 0, cost: 0 }
    },
    quotationNotes: ''
  };
  baseOptions: Shelving[] = [];

  shelvingTotal: Shelving = {
    name: '',
    quantity: 0,
    cost: 0,
    sell: 0
  };
  optionsTotal: Shelving = {
    name: '',
    quantity: 0,
    cost: 0,
    sell: 0
  };

  constructor(private saveDataService: SaveDataService) {}

  ngOnInit(): void {
    combineLatest([
      this.saveDataService.saveData$,
      this.saveDataService.carts$
    ]).pipe(
      filter(([saveData, carts]) => !!saveData && !!carts)
    ).subscribe(([saveData, carts]) => {
      if (JSON.stringify(this.baseOptions) !== JSON.stringify(saveData?.extra?.base?.extra)) {
        this.projectDetails.options = saveData?.extra?.base?.extra.map((option) => {
          return {
            ...option,
            quantity: 0,
            cost: 0,
            sell: 0
          }
        }) || [];
      }

      this.baseOptions = saveData?.extra?.base?.extra || [];

      this.projectDetails.shelving = carts?.map((cart) => {
        const product = saveData?.extra?.base?.shelving.find((item) => item.name === cart.name);
        return {
          name: cart.name,
          quantity: cart.quantity,
          cost: product ? Number(product?.cost) * Number(cart.quantity) : 0,
          sell: product ? Number(product?.sell) * Number(cart.quantity) : 0
        };
      }) || [];
      this.countInvestmentTotal();
    });
  }

  onOptionAmountChange(option: Shelving): void {
    const baseOption = this.baseOptions.find((item) => item.name === option.name);
    if (baseOption) {
      option.cost = Number(baseOption.cost) * Number(option.quantity);
      option.sell = Number(baseOption.sell) * Number(option.quantity);
    }
    this.countInvestmentTotal();
    this.updateProjectData();
  }

  onShippingDataChange(): void {
    this.countInvestmentTotal();
    this.updateProjectData();
  }

  onNotesChange(): void {
    this.updateProjectData();
  }

  countInvestmentTotal(): void {
    this.countShelvingTotal();
    this.countOptionsTotal();
    // @ts-ignore
    this.projectDetails.quotation['Total Investment'].cost = this.shelvingTotal.cost + this.optionsTotal.cost + this.projectDetails.quotation['Freight Inwards'].cost + this.projectDetails.quotation.Installation.cost + this.projectDetails.quotation.Delivery.cost;
    // @ts-ignore
    this.projectDetails.quotation['Total Investment'].sell = this.shelvingTotal.sell + this.optionsTotal.sell + this.projectDetails.quotation['Freight Inwards'].sell + this.projectDetails.quotation.Installation.sell + this.projectDetails.quotation.Delivery.sell;
    const GP = (this.projectDetails.quotation['Total Investment'].sell - this.projectDetails.quotation['Total Investment'].cost) / this.projectDetails.quotation['Total Investment'].cost * 100;
    this.projectDetails.quotation.GP.sell = isNaN(GP) ? 0 : Math.round(GP);
  }

  countShelvingTotal(): void {
    this.shelvingTotal = {
      name: '',
      quantity: 0,
      cost: 0,
      sell: 0
    };

    this.projectDetails.shelving.map((item) => {
      if (item.quantity && !isNaN(+item.quantity)) {
        // @ts-ignore
        this.shelvingTotal.quantity += item.quantity;
      }
      if (item.cost && !isNaN(+item.cost)) {
        // @ts-ignore
        this.shelvingTotal.cost += item.cost;
      }
      if (item.sell && !isNaN(+item.sell)) {
        // @ts-ignore
        this.shelvingTotal.sell += item.sell;
      }
    });
  }

  countOptionsTotal(): void {
    this.optionsTotal = {
      name: '',
      quantity: 0,
      cost: 0,
      sell: 0
    };

    this.projectDetails.options.map((item) => {
      if (item.quantity && !isNaN(+item.quantity)) {
        // @ts-ignore
        this.optionsTotal.quantity += item.quantity;
      }
      if (item.cost && !isNaN(+item.cost)) {
        // @ts-ignore
        this.optionsTotal.cost += item.cost;
      }
      if (item.sell && !isNaN(+item.sell)) {
        // @ts-ignore
        this.optionsTotal.sell += item.sell;
      }
    });
  }

  updateProjectData(): void {
    this.saveDataService.updateProject(this.projectDetails);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
