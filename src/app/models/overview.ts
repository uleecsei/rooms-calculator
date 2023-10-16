import { FileModel } from './file-model';

export interface Overview {
  facilityName: string;
  roomNumber: string;
  contactName: string;
  projectNumber: string;
  files: FileModel[];
}
