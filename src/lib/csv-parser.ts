import dayjs from 'dayjs';
import type { ICustomerDto } from '@/models/interface/dto';
import type { IUploadColumnMap, IUploadResult, IUploadValidationError } from '@/models/type/excel-upload';

const CUSTOMER_COLUMN_MAP: IUploadColumnMap[] = [
  { csvHeader: '이름', dtoField: 'name', required: true },
  { csvHeader: '휴대폰 번호', dtoField: 'phone', required: false },
  { csvHeader: '마케팅 수신동의', dtoField: 'marketingConsent', required: false },
  { csvHeader: '브라우저 ID', dtoField: 'browserId', required: false },
  { csvHeader: '고객 식별 번호', dtoField: 'customerId', required: false },
  { csvHeader: '최근 접속 시간', dtoField: 'lastAccess', required: false },
];

function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function parseCsvText(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    if (line.trim() === '') continue;

    const cells: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          cells.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
    }
    cells.push(current.trim());
    rows.push(cells);
  }

  return rows;
}

export function mapRowsToCustomers(
  headers: string[],
  rows: string[][],
  existingCount: number,
): IUploadResult {
  const errors: IUploadValidationError[] = [];
  const validRows: ICustomerDto[] = [];

  const headerIndexMap = new Map<string, number>();
  CUSTOMER_COLUMN_MAP.forEach((col) => {
    const idx = headers.findIndex((h) => h.trim() === col.csvHeader);
    if (idx !== -1) {
      headerIndexMap.set(col.dtoField, idx);
    }
  });

  const nameIdx = headerIndexMap.get('name');
  if (nameIdx === undefined) {
    return {
      validRows: [],
      errors: [{ row: 0, field: '이름', message: '필수 컬럼 "이름"이 없습니다.' }],
      totalRows: rows.length,
    };
  }

  rows.forEach((row, rowIdx) => {
    const rowNum = rowIdx + 2;
    const rowErrors: IUploadValidationError[] = [];

    const getValue = (field: keyof ICustomerDto): string => {
      const idx = headerIndexMap.get(field);
      if (idx === undefined || idx >= row.length) return '';
      return row[idx].trim();
    };

    const name = getValue('name');
    if (!name) {
      rowErrors.push({ row: rowNum, field: '이름', message: '이름은 필수 항목입니다.' });
    }

    const phone = getValue('phone') || '-';
    const marketingConsent = getValue('marketingConsent') || '-';
    const browserId = getValue('browserId') || generateUuid();
    const customerId = getValue('customerId') || generateUuid();
    const lastAccess = getValue('lastAccess') || dayjs().format('YYYY.MM.DD HH:mm:ss');

    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      validRows.push({
        no: existingCount + validRows.length + 1,
        name,
        phone,
        marketingConsent,
        browserId,
        customerId,
        lastAccess,
      });
    }
  });

  return { validRows, errors, totalRows: rows.length };
}

export function generateTemplateCsv(): string {
  const headers = CUSTOMER_COLUMN_MAP.map((col) => col.csvHeader).join(',');
  const example = '홍길동,010-1234-5678,동의,,,';
  return `${headers}\n${example}`;
}

export function downloadCsvFile(content: string, filename: string): void {
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
