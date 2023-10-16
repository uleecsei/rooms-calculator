import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';

import { SaveDataService } from './services/save-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private destroy$ = new Subject<void>();

  selectedTabIndex = 0;
  tabs = ['Project Overview', 'Project Details', 'Base Pricing', 'Master Pricing'];

  constructor(
    private saveDataService: SaveDataService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe((params) => {
      if (params['ihconfig']) {
        this.saveDataService.ihconfigId = params['ihconfig'];
        this.saveDataService.getInitialSaveData();
      }
    })
  }

  saveData(): void {
    this.saveDataService.updateSaveData().pipe(
      take(1)
    ).subscribe();

    this.saveDataService.updateMasterSaveData().pipe(
      take(1)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
