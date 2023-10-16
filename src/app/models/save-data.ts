import { Overview } from './overview';
import { Project } from './project';
import { Base } from './base';
import { Cart } from './cart';

export interface SaveData {
  data: any;
  configuration: {
    cart: Cart[];
  };
  extra: {
    overview: Overview;
    project: Project;
    base: Base;
  };
  image0: string;
}
