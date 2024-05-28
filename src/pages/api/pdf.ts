// // pdfGenerator.ts
// import jsPDF from 'jspdf';

// export const generatePDF = (userData: UserData, kuesionerData: KuesionerData) => {
//   const doc = new jsPDF();

//   // Tambahkan konten ke PDF Anda di sini
//   // Misalnya, Anda bisa menambahkan teks dengan doc.text('Hello world!', 10, 10)
//   doc.text('Data User:', 10, 10);
//   doc.text(`Nama: ${userData.nama}`, 10, 20);
//   doc.text(`Alamat: ${userData.alamat}`, 10, 30);
//   // Tambahkan lebih banyak data user dan kuesioner di sini

//   // Simpan PDF
//   doc.save('data.pdf');
// };
