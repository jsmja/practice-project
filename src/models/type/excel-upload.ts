import type { ICustomerDto } from '@/models/interface/dto';

export interface IUploadColumnMap {
  csvHeader: string;
  dtoField: keyof ICustomerDto;
  required: boolean;
}

export interface IUploadValidationError {
  row: number;
  field: string;
  message: string;
}

export interface IUploadResult {
  validRows: ICustomerDto[];
  errors: IUploadValidationError[];
  totalRows: number;
}

export type UploadStepType = 'idle' | 'preview' | 'uploading' | 'complete' | 'error';
