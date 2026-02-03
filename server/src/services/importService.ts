import fs from 'fs';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import path from 'path';
import { CompanyModel } from '../models/Company';
import { ContactModel } from '../models/Contact';
import { OpportunityModel } from '../models/Opportunity';

export const importService = {
  async parseHeaders(filePath: string): Promise<string[]> {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.csv') {
      return this.parseCSVHeaders(filePath);
    } else if (ext === '.xlsx' || ext === '.xls') {
      return this.parseExcelHeaders(filePath);
    }

    throw new Error('Unsupported file format');
  },

  async parseCSVHeaders(filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const headers: string[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headerList: string[]) => {
          resolve(headerList);
        })
        .on('error', reject);
    });
  },

  async parseExcelHeaders(filePath: string): Promise<string[]> {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (data.length === 0) {
      throw new Error('Empty file');
    }

    return data[0] as string[];
  },

  async importFile(
    filePath: string,
    entityType: string,
    columnMapping: Record<string, string>,
    userId?: number
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const ext = path.extname(filePath).toLowerCase();
    let rows: any[] = [];

    if (ext === '.csv') {
      rows = await this.parseCSV(filePath);
    } else if (ext === '.xlsx' || ext === '.xls') {
      rows = await this.parseExcel(filePath);
    }

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        const mappedData = this.mapRow(row, columnMapping);

        if (entityType === 'company') {
          await CompanyModel.create({ ...mappedData, created_by: userId });
        } else if (entityType === 'contact') {
          await ContactModel.create({ ...mappedData, created_by: userId });
        } else if (entityType === 'opportunity') {
          await OpportunityModel.create({ ...mappedData, created_by: userId });
        }

        success++;
      } catch (error: any) {
        failed++;
        errors.push(error.message);
      }
    }

    fs.unlinkSync(filePath);

    return { success, failed, errors };
  },

  async parseCSV(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const rows: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  },

  async parseExcel(filePath: string): Promise<any[]> {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
  },

  mapRow(row: any, columnMapping: Record<string, string>): any {
    const mappedData: any = {};

    for (const [fileColumn, dbColumn] of Object.entries(columnMapping)) {
      if (row[fileColumn] !== undefined && row[fileColumn] !== null && row[fileColumn] !== '') {
        mappedData[dbColumn] = row[fileColumn];
      }
    }

    return mappedData;
  },
};
