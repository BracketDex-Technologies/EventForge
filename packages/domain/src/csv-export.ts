export interface CsvColumn<Row extends Record<string, unknown>> {
  key: keyof Row & string;
  header: string;
}

export interface BuildCsvInput<Row extends Record<string, unknown>> {
  columns: CsvColumn<Row>[];
  rows: Row[];
}

export function buildCsv<Row extends Record<string, unknown>>({
  columns,
  rows,
}: BuildCsvInput<Row>) {
  const header = columns.map(column => escapeCsvCell(column.header)).join(',');
  const body = rows.map(row =>
    columns.map(column => escapeCsvCell(row[column.key])).join(','),
  );

  return [header, ...body].join('\r\n');
}

function escapeCsvCell(value: unknown) {
  if (value === null || value === undefined) {
    return '';
  }

  const text = String(value);
  if (!/[",\r\n]/.test(text)) {
    return text;
  }

  return `"${text.replaceAll('"', '""')}"`;
}
