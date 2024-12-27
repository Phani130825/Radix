// import React, { useEffect, useState } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebase'; // Adjust the path to your Firebase setup file
// import '../styles/ViewReports.css';

// const ViewReports = ({ email }) => {
//   const [reports, setReports] = useState([]);

//   useEffect(() => {
//     if (!email) return;

//     const fetchReports = async () => {
//       try {
//         const reportsRef = collection(db, 'login', email, 'report');
//         const reportSnapshots = await getDocs(reportsRef);
//         const reportsData = reportSnapshots.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setReports(reportsData);
//       } catch (err) {
//         console.error('Error fetching reports:', err);
//         alert('Failed to load reports. Please try again later.');
//       }
//     };

//     fetchReports();
//   }, [email]);

//   return (
//     <div className="view-reports-container">
//       <h2>Your Reports</h2>
//       <div className="reports-list">
//         {reports.map(report => (
//           <div className="report-card" key={report.id}>
//             <div className="report-details">
//               <h3>Report ID: {report.id}</h3>
//               <p><strong>Class:</strong> {report.class}</p>
//               <p><strong>Advice:</strong> {report.advice}</p>
//             </div>
//             <div className="report-image">
//               <img src={report.image} alt={`Report ${report.id}`} />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ViewReports;


// import React, { useEffect, useState } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';
// import { db } from '../firebase'; // Adjust the path to your Firebase setup file
// import '../styles/ViewReports.css';

// const ViewReports = ({ email }) => {
//   const [reports, setReports] = useState([]);

//   useEffect(() => {
//     if (!email) return;

//     const fetchReports = async () => {
//       try {
//         const reportsRef = collection(db, 'login', email, 'report');
//         const reportSnapshots = await getDocs(reportsRef);
//         const reportsData = reportSnapshots.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setReports(reportsData);
//       } catch (err) {
//         console.error('Error fetching reports:', err);
//         alert('Failed to load reports. Please try again later.');
//       }
//     };

//     fetchReports();
//   }, [email]);

//   const downloadPDF = async (report) => {
//     const doc = new jsPDF();
//     const watermarkText = "Radix";

//     // Add watermark
//     doc.setTextColor(200, 200, 200);
//     doc.setFontSize(40);
//     doc.text(watermarkText, 50, 50, { angle: 45 });

//     // Add heading
//     doc.setTextColor(0, 0, 0);
//     doc.setFontSize(16);
//     doc.text("Radix Report", 105, 20, null, null, "center");

//     // Add report details
//     doc.setFontSize(12);
//     doc.text(`Report ID: ${report.id}`, 20, 40);
//     doc.text(`Class: ${report.class}`, 20, 50);
//     doc.text(`Advice: ${report.advice}`, 20, 60);

//     // Add image
//     if (report.image) {
//       const image = await fetch(report.image).then((res) => res.blob());
//       const imageData = await new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result);
//         reader.readAsDataURL(image);
//       });

//       doc.addImage(imageData, 'JPEG', 20, 70, 150, 100); // Adjust dimensions as needed
//     }

//     // Save PDF
//     doc.save(`Report_${report.id}.pdf`);
//   };

//   return (
//     <div className="view-reports-container">
//       <h2>Your Reports</h2>
//       <div className="reports-list">
//         {reports.map(report => (
//           <div className="report-card" key={report.id}>
//             <div className="report-details">
//               <h3>Report ID: {report.id}</h3>
//               <p><strong>Class:</strong> {report.class}</p>
//               <p><strong>Advice:</strong> {report.advice}</p>
//             </div>
//             <div className="report-image">
//               <img src={report.image} alt={`Report ${report.id}`} />
//             </div>
//             <button
//               className="download-pdf-button"
//               onClick={() => downloadPDF(report)}
//             >
//               Download PDF
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ViewReports;

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import { db } from '../firebase'; // Adjust the path to your Firebase setup file
import '../styles/ViewReports.css';

const ViewReports = ({ email }) => {
  const [reports, setReports] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!email) return;

    const fetchReportsAndUserInfo = async () => {
      try {
        // Fetch user details
        const userDocRef = doc(db, 'login', email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          console.error('User not found');
          return;
        }

        // Fetch reports
        const reportsRef = collection(db, 'login', email, 'report');
        const reportSnapshots = await getDocs(reportsRef);
        const reportsData = reportSnapshots.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsData);
      } catch (err) {
        console.error('Error fetching reports or user info:', err);
        alert('Failed to load reports. Please try again later.');
      }
    };

    fetchReportsAndUserInfo();
  }, [email]);

  // const downloadPDF = async (report) => {
  //   const doc = new jsPDF();
  
  //   // Add background color
  //   doc.setFillColor(255, 204, 153); // Light orange
  //   doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
  //   // Add heading
  //   doc.setFontSize(20);
  //   doc.setTextColor(0, 0, 0); // Black text
  //   doc.text('RaDix', 105, 20, null, null, 'center');
  
  //   // Add contact email
  //   doc.setFontSize(12);
  //   doc.text('Contact: 108radix@gmail.com', 105, 30, null, null, 'center');
  
  //   // Add timestamp
  //   const timestamp = new Date().toLocaleString();
  //   doc.setFontSize(10);
  //   doc.text(`Downloaded on: ${timestamp}`, 105, 40, null, null, 'center');
  
  //   // Add separator line
  //   doc.line(10, 50, 200, 50);
  
  //   // Add user details
  //   if (userInfo) {
  //     doc.setFontSize(12);
  //     doc.text(`Name: ${userInfo.name}`, 20, 60);
  //     doc.text(`Age: ${userInfo.age}`, 20, 70);
  //     doc.text(`Weight: ${userInfo.weight}`, 20, 80);
  //     doc.text(`Height: ${userInfo.height}`, 20, 90);
  //   }
  
  //   // Add report details
  //   doc.text(`Report ID: ${report.id}`, 20, 100);
  //   doc.text(`Class: ${report.class}`, 20, 110);
  //   doc.text(`Advice: ${report.advice}`, 20, 120);
  
  //   // Add another separator line
  //   doc.line(10, 130, 200, 130);
  
  //   // Add image centered on the sheet
  //   if (report.image) {
  //     const image = await fetch(report.image).then((res) => res.blob());
  //     const imageData = await new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.onload = () => resolve(reader.result);
  //       reader.readAsDataURL(image);
  //     });
  
  //     // Center image on the page
  //     const imgX = 40; // Horizontal margin
  //     const imgY = 140; // Starting Y position for image
  //     const imgWidth = 130;
  //     const imgHeight = 100; // Adjust to fit proportions
  
  //     doc.addImage(imageData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
  //   }
  
  //   // Save PDF with report ID
  //   doc.save(`RaDix_Report_${report.id}.pdf`);
  // };
  // const downloadPDF = async (report) => {
  //   const doc = new jsPDF();
  
  //   // Add background color
  //   doc.setFillColor(255, 204, 153); // Light orange
  //   doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
  //   // Add watermark text and logo
  //   const watermarkText = 'Radix';
  //   const watermarkLogoPath = '/1000056406.png'; // Ensure this path is accessible in your React project
  
  //   const addWatermark = async () => {
  //     // Load the watermark image
  //     const response = await fetch(watermarkLogoPath);
  //     const watermarkBlob = await response.blob();
  //     const watermarkData = await new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.onload = () => resolve(reader.result);
  //       reader.readAsDataURL(watermarkBlob);
  //     });
  
  //     // Set opacity for watermark
  //     doc.setGState(new doc.GState({ opacity: 0.5 }));
  
  //     // Add watermark text and logo
  //     const pageWidth = doc.internal.pageSize.width;
  //     const pageHeight = doc.internal.pageSize.height;
  //     const logoWidth = 20; // Adjust as needed
  //     const logoHeight = 20; // Adjust as needed
  //     const padding = 10; // Space between logo and text
  
  //     for (let y = 0; y < pageHeight; y += 40) {
  //       for (let x = 0; x < pageWidth; x += 100) {
  //         // Add text
  //         doc.setFontSize(12);
  //         doc.text(watermarkText, x + padding, y + padding);
  
  //         // Add logo next to text
  //         doc.addImage(watermarkData, 'PNG', x + padding + 30, y + padding - 10, logoWidth, logoHeight);
  //       }
  //     }
  
  //     // Reset opacity
  //     doc.setGState(new doc.GState({ opacity: 1 }));
  //   };
  
  //   await addWatermark();
  
  //   // Add heading
  //   doc.setFontSize(20);
  //   doc.setTextColor(0, 0, 0); // Black text
  //   doc.text('RaDix', 105, 20, null, null, 'center');
  
  //   // Add contact email
  //   doc.setFontSize(12);
  //   doc.text('Contact: 108radix@gmail.com', 105, 30, null, null, 'center');
  
  //   // Add timestamp
  //   const timestamp = new Date().toLocaleString();
  //   doc.setFontSize(10);
  //   doc.text(`Downloaded on: ${timestamp}`, 105, 40, null, null, 'center');
  
  //   // Add separator line
  //   doc.line(10, 50, 200, 50);
  
  //   // Add user details
  //   if (userInfo) {
  //     doc.setFontSize(12);
  //     doc.text(`Name: ${userInfo.name}`, 20, 60);
  //     doc.text(`Age: ${userInfo.age}`, 20, 70);
  //     doc.text(`Weight: ${userInfo.weight}`, 20, 80);
  //     doc.text(`Height: ${userInfo.height}`, 20, 90);
  //   }
  
  //   // Add report details
  //   doc.text(`Report ID: ${report.id}`, 20, 100);
  //   doc.text(`Class: ${report.class}`, 20, 110);
  //   doc.text(`Advice: ${report.advice}`, 20, 120);
  
  //   // Add another separator line
  //   doc.line(10, 130, 200, 130);
  
  //   // Add image centered on the sheet
  //   if (report.image) {
  //     const image = await fetch(report.image).then((res) => res.blob());
  //     const imageData = await new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.onload = () => resolve(reader.result);
  //       reader.readAsDataURL(image);
  //     });
  
  //     // Center image on the page
  //     const imgX = 40; // Horizontal margin
  //     const imgY = 140; // Starting Y position for image
  //     const imgWidth = 130;
  //     const imgHeight = 100; // Adjust to fit proportions
  
  //     doc.addImage(imageData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
  //   }
  
  //   // Save PDF with report ID
  //   doc.save(`RaDix_Report_${report.id}.pdf`);
  // };
  const downloadPDF = async (report) => {
    const doc = new jsPDF();
  
    // Add background color
    doc.setFillColor(255, 255, 255); // Light orange
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
    // Add watermark logo
    const watermarkLogoPath = '/1000056406.png'; // Ensure this path is accessible in your React project
  
    const addWatermark = async () => {
      // Load the watermark image
      const response = await fetch(watermarkLogoPath);
      const watermarkBlob = await response.blob();
      const watermarkData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(watermarkBlob);
      });
    
      // Set opacity for watermark
      doc.setGState(new doc.GState({ opacity: 0.2 }));
    
      // Calculate watermark position
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const logoWidth = 100; // Adjust to make the logo look big
      const logoHeight = 100; // Maintain aspect ratio
    
      const x = (pageWidth - logoWidth) / 2; // Center horizontally
      const y = (pageHeight / 4) - (logoHeight / 2); // Center vertically within the top half
    
      doc.addImage(watermarkData, 'PNG', x, y, logoWidth, logoHeight);
    
      // Reset opacity
      doc.setGState(new doc.GState({ opacity: 1 }));
    };
    
  
    await addWatermark();
  
    // Add heading
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0); // Black text
    doc.text('RaDix', 105, 20, null, null, 'center');
  
    // Add contact email
    doc.setFontSize(12);
    doc.text('Contact: 108radix@gmail.com', 105, 30, null, null, 'center');
  
    // Add timestamp
    const timestamp = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Downloaded on: ${timestamp}`, 105, 40, null, null, 'center');
  
    // Add separator line
    doc.line(10, 50, 200, 50);
  
    // Add user details
    if (userInfo) {
      doc.setFontSize(12);
      doc.text(`Name: ${userInfo.name}`, 20, 60);
      doc.text(`Age: ${userInfo.age}`, 20, 70);
      doc.text(`Weight: ${userInfo.weight}`, 20, 80);
      doc.text(`Height: ${userInfo.height}`, 20, 90);
    }
  
    // Add report details
    doc.text(`Report ID: ${report.id}`, 20, 100);
    doc.text(`Class: ${report.class}`, 20, 110);
    doc.text(`Advice: ${report.advice}`, 20, 120);
  
    // Add another separator line
    doc.line(10, 130, 200, 130);
  
    // Add image centered on the sheet
    if (report.image) {
      const image = await fetch(report.image).then((res) => res.blob());
      const imageData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(image);
      });
  
      // Center image on the page
      const imgX = 40; // Horizontal margin
      const imgY = 140; // Starting Y position for image
      const imgWidth = 130;
      const imgHeight = 100; // Adjust to fit proportions
  
      doc.addImage(imageData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
    }
  
    // Save PDF with report ID
    doc.save(`RaDix_Report_${report.id}.pdf`);
  };
   

  return (
    <div className="view-reports-container">
      <h2>Your Reports</h2>
      <div className="reports-list">
        {reports.map((report) => (
          <div className="report-card" key={report.id}>
            <div className="report-details">
              <h3>Report ID: {report.id}</h3>
              <p>
                <strong>Class:</strong> {report.class}
              </p>
              <p>
                <strong>Advice:</strong> {report.advice}
              </p>
            </div>
            <div className="report-image">
              <img src={report.image} alt={`Report ${report.id}`} />
            </div>
            <button
              className="download-pdf-button"
              onClick={() => downloadPDF(report)}
            >
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewReports;
