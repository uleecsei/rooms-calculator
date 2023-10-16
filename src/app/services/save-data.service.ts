import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { SaveData } from '../models/save-data';
import { environment } from '../../environments/environment';
import { Overview } from '../models/overview';
import { Project } from '../models/project';
import { Base } from '../models/base';
import { Shelving } from '../models/shelving';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {
  ihconfigId?: number;
  masterihconfigId = '64eeb41dc6746e261d0a63a7';

  saveData$ = new BehaviorSubject<SaveData | null>(null);
  saveDataAsObservable$ = this.saveData$.asObservable();

  carts$ = new BehaviorSubject<Shelving[] | null>(null);
  cartsAsObservable$ = this.carts$.asObservable();

  masterSaveData$ = new BehaviorSubject<SaveData | null>(null);
  masterSaveDataAsObservable$ = this.masterSaveData$.asObservable();

  constructor(private httpClient: HttpClient) { }

  getInitialSaveData(): void {
    combineLatest([
      this.getSaveData(),
      this.getMasterSaveData()
    ]).subscribe(([saveData, masterSaveData]) => {
      const extra = {
        overview: {
          facilityName: '',
          roomNumber: '',
          contactName: '',
          projectNumber: '',
          files: []
        },
        project: {
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
          quotationNotes: '',
        },
        base: masterSaveData.extra.base,
      };

      const initialSaveData: SaveData = {
        ...saveData,
        extra: saveData.extra ? saveData.extra : extra
      };

      if (!initialSaveData.extra.overview) {
        initialSaveData.extra.overview = extra.overview;
      }

      if (!initialSaveData.extra.project) {
        initialSaveData.extra.project = extra.project;
      }

      if (!initialSaveData.extra.base) {
        initialSaveData.extra.base = extra.base;
      }

      const carts = saveData?.configuration?.cart?.map(item => {
        return {
          name: item.product.name,
          quantity: item.quantity,
          cost: null,
          sell: null,
        }
      }) || [];

      this.saveData$.next(initialSaveData);
      this.carts$.next(carts);
      this.masterSaveData$.next(masterSaveData);
    });
  }

  getSaveData(): Observable<SaveData> {
    return this.httpClient.get<SaveData>(`${environment.apiUrl}load/${this.ihconfigId}`);
  }

  getMasterSaveData(): Observable<SaveData> {
    return this.httpClient.get<SaveData>(`${environment.apiUrl}load/${this.masterihconfigId}`);
  }

  updateSaveData(): Observable<any> {
    return this.httpClient.post<SaveData>(`${environment.apiUrl}save/${this.ihconfigId}/64d08e6ddc185246acea16e5`, { extra: this.saveData$.value?.extra });
  }

  updateMasterSaveData(): Observable<any> {
    return this.httpClient.post<SaveData>(`${environment.apiUrl}save/${this.masterihconfigId}/64d08e6ddc185246acea16e5`, { extra: this.masterSaveData$.value?.extra });
  }

  updateOverview(overview: Overview): void {
    const saveData = this.saveData$.value;
    if (!saveData) {
      return;
    }
    saveData.extra.overview = overview;
    this.saveData$.next(saveData);
    console.log(this.saveData$.value);
  }

  updateProject(project: Project): void {
    const saveData = this.saveData$.value;
    if (!saveData) {
      return;
    }
    saveData.extra.project = project;
    this.saveData$.next(saveData);
    console.log(this.saveData$.value);
  }

  updateBase(base: Base): void {
    const saveData = this.saveData$.value;
    if (!saveData) {
      return;
    }
    saveData.extra.base = base;
    this.saveData$.next(saveData);
    console.log(this.saveData$.value);
  }

  updateMasterData(masterBase: Base): void {
    const masterSaveData = this.masterSaveData$.value;
    if (!masterSaveData) {
      return;
    }
    masterSaveData.extra.base = masterBase;
    this.masterSaveData$.next(masterSaveData);
    console.log(this.masterSaveData$.value);
  }
}
