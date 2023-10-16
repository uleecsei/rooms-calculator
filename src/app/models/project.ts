import { Shelving } from './shelving';
import { Quotation } from './quotation';

export interface Project {
  shelving: Shelving[];
  shelvingNotes: string;
  options: Shelving[];
  optionsNotes: string;
  quotation: {
    'Freight Inwards': Quotation;
    'Installation': Quotation;
    'Delivery': Quotation;
    'Total Investment': Quotation;
    'GP': Quotation;
  }
  quotationNotes: string;
}
