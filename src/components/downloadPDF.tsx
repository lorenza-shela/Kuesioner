// // File: components/DownloadPDF.tsx

// import { FC, MouseEvent } from 'react';
// import { generatePDF } from '@/helpers/pdf';
// import { KuesionerData } from '@/components/kepalaSekolah/dataKepsek'; // Import the KuesionerData type

// interface DownloadPDFProps {
//   data: KuesionerData; // Change this to accept KuesionerData
// }

// const DownloadPDF: FC<DownloadPDFProps> = ({ data }) => {
//   const handleDownload = (event: MouseEvent<HTMLButtonElement>) => {
//     event.preventDefault();
//     const pdfDataUri = generatePDF(data);
//     const link = document.createElement('a');
//     link.href = pdfDataUri;
//     link.download = 'data.pdf';
//     link.click();
//   };

//   return <button onClick={handleDownload}>Download PDF</button>;
// };

// export default DownloadPDF;
