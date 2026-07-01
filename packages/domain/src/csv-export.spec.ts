import { describe, expect, it } from 'vitest';
import { buildCsv } from './csv-export';

describe('buildCsv', () => {
  it('exports rows with stable header order', () => {
    const csv = buildCsv({
      columns: [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
      ],
      rows: [
        { name: 'Alex Rivers', email: 'alex@example.com' },
        { name: 'Emily Watson', email: 'emily@example.com' },
      ],
    });

    expect(csv).toBe('Name,Email\r\nAlex Rivers,alex@example.com\r\nEmily Watson,emily@example.com');
  });

  it('escapes commas, quotes, and newlines', () => {
    const csv = buildCsv({
      columns: [
        { key: 'name', header: 'Name' },
        { key: 'notes', header: 'Notes' },
      ],
      rows: [{ name: 'LaunchGrid, Inc.', notes: 'Asked about "CRM sync"\nand scoring.' }],
    });

    expect(csv).toBe('Name,Notes\r\n"LaunchGrid, Inc.","Asked about ""CRM sync""\nand scoring."');
  });

  it('serializes nullish values as empty cells', () => {
    const csv = buildCsv({
      columns: [{ key: 'company', header: 'Company' }],
      rows: [{ company: null }, { company: undefined }],
    });

    expect(csv).toBe('Company\r\n\r\n');
  });
});
