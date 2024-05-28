// // File: lib/pdf.ts

// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';

// // Tambahkan autoTable ke prototype jsPDF
// (jsPDF as any).autoTable = autoTable;

// // Deklarasikan modul 'jspdf' dan tambahkan autoTable ke tipe jsPDF
// declare module 'jspdf' {
//   interface jsPDF {
//     autoTable: typeof autoTable;
//   }
// }

// // Import the KuesionerData type
// import { KuesionerData } from '@/components/kepalaSekolah/dataKepsek';

// export function generatePDF(data: KuesionerData): any {
//   const doc = new jsPDF();

//   // Add title
//   doc.setFontSize(22);
//   doc.text('HASIL PENILAIAN KUESIONER KINERJA GURU PENGGERAK', 10, 10);

//   // Define the columns
//   const columns = [{ header: 'Field' }, { header: 'Value' }];

//   // Define the rows
//   const rows = Object.keys(data).map((key) => [key, data[key]]);

//   console.log(columns);
//   // Add the table
//   doc.autoTable(
//     {
//       columns: columns,
//       body: rows,
//     },
//     {
//       startY: 20,
//     }
//   );

//   return doc.output('datauristring');
// }
