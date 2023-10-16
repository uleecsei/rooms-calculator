import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup } from '@angular/forms';
import { filter, Subject, take, takeUntil } from 'rxjs';

import { SaveFileService } from '../../services/save-file.service';
import { SaveDataService } from '../../services/save-data.service';
import { Overview } from '../../models/overview';
import { FileModel } from '../../models/file-model';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  img = '';
  form!: UntypedFormGroup;
  files: FileModel[] = [];
  saveData$ = this.saveDataService.saveDataAsObservable$;

  constructor(
    private fb: FormBuilder,
    private saveFileService: SaveFileService,
    private saveDataService: SaveDataService
  ) {
    this.initControls();
  }

  ngOnInit(): void {
    this.saveData$.pipe(
      filter((saveData) => !!saveData && !!saveData.extra && !!saveData.extra.overview),
      take(1)
    ).subscribe((saveData) => {
      this.formControls['facilityName'].setValue(saveData?.extra.overview.facilityName, { emitEvent: false });
      this.formControls['roomNumber'].setValue(saveData?.extra.overview.roomNumber, { emitEvent: false });
      this.formControls['contactName'].setValue(saveData?.extra.overview.contactName, { emitEvent: false });
      this.formControls['projectNumber'].setValue(saveData?.extra.overview.projectNumber, { emitEvent: false });
      this.files = saveData?.extra.overview.files as FileModel[];
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  private initControls(): void {
    this.form = this.fb.group({
      facilityName: [''],
      roomNumber: [''],
      contactName: [''],
      projectNumber: ['']
    });

    this.form.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateOverviewData();
    });
  }

  onFileChanged(event: any) {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.uploadFile(files[0]);
    }
  }

  uploadFile(file: File): void {
    const indexOfCurrentFile = this.files.findIndex((item) => item.name === file.name);
    if (indexOfCurrentFile + 1) {
      return;
    }
    this.saveFileService.saveFileToApi(file).pipe(
      takeUntil(this.destroy$)
    ).subscribe((fileResponse) => {
      this.files.push({
        name: file.name,
        path: fileResponse.file
      });
      this.updateOverviewData();
    });
  }

  viewFile(path: string): void {
    window.open(path, '_blank');
  }

  deleteFile(name: string): void {
    this.files = this.files.filter((item) => item.name !== name);
    this.updateOverviewData();
  }

  updateOverviewData(): void {
    const overviewData: Overview = {
      ...this.form.getRawValue(),
      files: this.files
    }
    this.saveDataService.updateOverview(overviewData);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
