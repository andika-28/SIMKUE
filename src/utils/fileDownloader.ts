/**
 * File Downloader Utility for SIMKEU Pesantren
 * Triggers real browser file downloads to the user's Downloads folder
 */

export interface ExportTableData {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
  summary?: { label: string; value: string | number }[];
}

/**
 * Downloads data as a CSV file with UTF-8 BOM
 */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const sanitize = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(sanitize).join(','),
    ...rows.map((row) => row.map(sanitize).join(',')),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerBrowserDownload(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

/**
 * Downloads data as an Excel-compatible spreadsheet (.xls) with formatting
 */
export function downloadExcelSpreadsheet(
  filename: string,
  tableData: ExportTableData
) {
  const { title, subtitle, headers, rows, summary } = tableData;

  let html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"/>
    <!--[if gte mso 9]>
    <xml>
      <x:ExcelWorkbook>
        <x:ExcelWorksheets>
          <x:ExcelWorksheet>
            <x:Name>Laporan</x:Name>
            <x:WorksheetOptions>
              <x:DisplayGridlines/>
            </x:WorksheetOptions>
          </x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml>
    <![endif]-->
    <style>
      body { font-family: Arial, sans-serif; font-size: 10pt; }
      .kop-title { font-size: 13pt; font-weight: bold; color: #064e3b; text-align: left; }
      .kop-sub { font-size: 9pt; color: #475569; }
      .table-header { background-color: #064E3B; color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #04382a; }
      .table-cell { border: 1px solid #cbd5e1; padding: 6px 10px; }
      .table-cell-num { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: right; }
      .row-even { background-color: #f8fafc; }
      .row-odd { background-color: #ffffff; }
      .summary-cell { background-color: #f1f5f9; font-weight: bold; border: 1px solid #94a3b8; }
    </style>
  </head>
  <body>
    <table border="0">
      <tr>
        <td colspan="${headers.length}" class="kop-title">PONDOK MODERN RAUDHATUSSALAM MAHATO</td>
      </tr>
      <tr>
        <td colspan="${headers.length}" class="kop-sub">Sistem Informasi Keuangan (SIMKEU) Pesantren</td>
      </tr>
      <tr>
        <td colspan="${headers.length}" style="font-weight:bold;font-size:11pt;color:#1e293b;padding-top:8px;">${title}</td>
      </tr>
      ${subtitle ? `<tr><td colspan="${headers.length}" style="color:#64748b;font-size:9pt;padding-bottom:12px;">${subtitle} • Dicetak: ${new Date().toLocaleDateString('id-ID')}</td></tr>` : ''}
      <tr><td colspan="${headers.length}"></td></tr>
    </table>

    <table border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>
          ${headers.map((h) => `<th class="table-header">${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row, rIdx) => `
          <tr class="${rIdx % 2 === 0 ? 'row-even' : 'row-odd'}">
            ${row
              .map((cell) => {
                const isNum = typeof cell === 'number' || (typeof cell === 'string' && cell.startsWith('Rp'));
                return `<td class="${isNum ? 'table-cell-num' : 'table-cell'}">${cell ?? ''}</td>`;
              })
              .join('')}
          </tr>`
          )
          .join('')}
      </tbody>
      ${
        summary && summary.length > 0
          ? `<tfoot>
              ${summary
                .map(
                  (s) => `
                <tr>
                  <td colspan="${headers.length - 1}" class="summary-cell" style="text-align:right;">${s.label}:</td>
                  <td class="summary-cell" style="text-align:right;">${s.value}</td>
                </tr>`
                )
                .join('')}
            </tfoot>`
          : ''
      }
    </table>
  </body>
  </html>
  `;

  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const finalFilename = filename.endsWith('.xls') || filename.endsWith('.xlsx')
    ? filename.replace(/\.xlsx$/, '.xls')
    : `${filename}.xls`;
  triggerBrowserDownload(blob, finalFilename);
}

/**
 * Downloads a printable HTML report document and prompts print-to-PDF
 */
export function downloadPrintableReport(filename: string, title: string, contentHtml: string) {
  const fullHtml = `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <title>${title} - SIMKEU PM. Raudhatussalam Mahato</title>
    <style>
      @page { size: A4; margin: 15mm; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; line-height: 1.4; font-size: 11px; margin: 0; padding: 20px; background: #fff; }
      .kop-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #064E3B; padding-bottom: 12px; margin-bottom: 16px; }
      .kop-logo { font-size: 24px; font-weight: 900; color: #064E3B; }
      .kop-text h1 { margin: 0; font-size: 14px; font-weight: 800; text-transform: uppercase; color: #064E3B; }
      .kop-text p { margin: 2px 0 0 0; font-size: 9px; color: #64748b; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 10px; }
      th { background-color: #064E3B; color: #ffffff; font-weight: bold; text-align: left; padding: 6px 8px; border: 1px solid #cbd5e1; }
      td { padding: 6px 8px; border: 1px solid #e2e8f0; }
      tr:nth-child(even) { background-color: #f8fafc; }
      .text-right { text-align: right; }
      .text-center { text-align: center; }
      .font-bold { font-weight: bold; }
      .footer-signatures { margin-top: 30px; display: flex; justify-content: space-between; }
      .signature-box { width: 200px; text-align: center; }
      .signature-space { height: 50px; }
      @media print {
        body { padding: 0; }
        .no-print { display: none !important; }
      }
    </style>
  </head>
  <body>
    <div class="no-print" style="margin-bottom: 20px; padding: 10px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
      <span><strong>Dokumen Resmi SIMKEU Pesantren</strong> - Klik cetak untuk menyimpan sebagai PDF</span>
      <button onclick="window.print()" style="background: #064E3B; color: white; border: none; padding: 6px 14px; border-radius: 4px; font-weight: bold; cursor: pointer;">Cetak / Simpan PDF</button>
    </div>
    ${contentHtml}
  </body>
  </html>
  `;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
  const finalFilename = filename.endsWith('.html') ? filename : `${filename}.html`;
  triggerBrowserDownload(blob, finalFilename);
}

/**
 * Triggers native browser download via link click
 */
export function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // Cleanup after browser initiates download
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 300);
}
