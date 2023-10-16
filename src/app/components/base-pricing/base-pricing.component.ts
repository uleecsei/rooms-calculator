import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { filter, Subject, take, takeUntil } from 'rxjs';

import { SaveDataService } from '../../services/save-data.service';
import { Base } from '../../models/base';
import { Shelving } from '../../models/shelving';

@Component({
  selector: 'app-base-pricing',
  templateUrl: './base-pricing.component.html',
  styleUrls: ['./base-pricing.component.scss']
})
export class BasePricingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  shelvingForm!: UntypedFormGroup;
  optionsForm!: UntypedFormGroup;

  get shelvingList(): UntypedFormArray {
    return this.shelvingForm.get('shelvingList') as UntypedFormArray;
  }

  get optionsList(): UntypedFormArray {
    return this.optionsForm.get('optionsList') as UntypedFormArray;
  }

  constructor(
    private saveDataService: SaveDataService,
    private fb: FormBuilder
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.saveDataService.saveDataAsObservable$.pipe(
      filter((saveData) => !!saveData && !!saveData.extra && !!saveData.extra.base),
      take(1)
    ).subscribe((saveData) => {
      this.initFormArrays(saveData?.extra.base.shelving as Shelving[], saveData?.extra.base.extra as Shelving[]);
    });
  }

  private initForms(): void {
    this.shelvingForm = this.fb.group({
      shelvingList: this.fb.array([])
    });

    this.optionsForm = this.fb.group({
      optionsList: this.fb.array([])
    });
  }

  private initFormArrays(shelving: Shelving[], options: Shelving[]): void {
    shelving.map((item) => {
      this.shelvingList.push(this.initShelvingFormGroup(item));
    });

    this.shelvingList.push(this.initShelvingFormGroup({
      name: '',
      cost: null,
      sell: null
    }));

    options.map((item) => {
      this.optionsList.push(this.initOptionsFormGroup(item));
    });

    this.optionsList.push(this.initOptionsFormGroup({
      name: '',
      cost: null,
      sell: null
    }));
  }

  private initShelvingFormGroup(item: Shelving): UntypedFormGroup {
    const formGroup = this.fb.group({
      name: [item.name],
      cost: [item.cost],
      sell: [item.sell]
    });

    formGroup.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const items = this.shelvingList.getRawValue() as Shelving[];
      const lastItem = items[items.length - 1];
      if (!items.length || !!lastItem.name || lastItem.cost !== null || lastItem.sell !== null) {
        this.shelvingList.push(this.initShelvingFormGroup({
          name: '',
          cost: null,
          sell: null
        }));
      }
      this.updateBaseData();
    });

    return formGroup;
  }

  private initOptionsFormGroup(item: Shelving): UntypedFormGroup {
    const formGroup = this.fb.group({
      name: [item.name],
      cost: [item.cost],
      sell: [item.sell]
    });

    formGroup.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const items = this.optionsList.getRawValue() as Shelving[];
      const lastItem = items[items.length - 1];
      if (!items.length || !!lastItem.name || lastItem.cost !== null || lastItem.sell !== null) {
        this.optionsList.push(this.initOptionsFormGroup({
          name: '',
          cost: null,
          sell: null
        }));
      }
      this.updateBaseData();
    });

    return formGroup;
  }

  removeShelving(index: number): void {
    if (index === this.shelvingList.controls.length - 1) {
      return;
    }
    this.shelvingList.removeAt(index);
    this.updateBaseData();
  }

  removeOption(index: number): void {
    if (index === this.optionsList.controls.length - 1) {
      return;
    }
    this.optionsList.removeAt(index);
    this.updateBaseData();
  }

  updateBaseData(): void {
    const baseData: Base = {
      shelving: this.shelvingList.getRawValue().filter((item) => !!item.name),
      extra: this.optionsList.getRawValue().filter((item) => !!item.name)
    };
    this.saveDataService.updateBase(baseData);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
