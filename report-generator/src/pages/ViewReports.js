

// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
// import { jsPDF } from 'jspdf';
// import { db } from '../firebase'; // Adjust the path to your Firebase setup file
// import '../styles/ViewReports.css';

// const ViewReports = ({ email }) => {
//   const [reports, setReports] = useState([]);
//   const [userInfo, setUserInfo] = useState(null);

//   useEffect(() => {
//     if (!email) return;

//     const fetchReportsAndUserInfo = async () => {
//       try {
//         // Fetch user details
//         const userDocRef = doc(db, 'login', email);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists()) {
//           setUserInfo(userDoc.data());
//         } else {
//           console.error('User not found');
//           return;
//         }

//         // Fetch reports
//         const reportsRef = collection(db, 'login', email, 'report');
//         const reportSnapshots = await getDocs(reportsRef);
//         const reportsData = reportSnapshots.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setReports(reportsData);
//       } catch (err) {
//         console.error('Error fetching reports or user info:', err);
//         alert('Failed to load reports. Please try again later.');
//       }
//     };

//     fetchReportsAndUserInfo();
//   }, [email]);

//   const downloadPDF = async (report) => {
//     const doc = new jsPDF();
  
//     // Add background color
//     doc.setFillColor(255, 255, 255); // Light orange
//     doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
//     // Add watermark logo
//     const watermarkLogoPath = '/1000056406.png'; // Ensure this path is accessible in your React project
    
     
//     const watermarkOpacity = 0.2;

//     const watermarkImage = await fetch(watermarkLogoPath).then((res) => res.blob());
//     const watermarkImageData = await new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.readAsDataURL(watermarkImage);
//     });

//     // Set the watermark position and size
//     const watermarkWidth = 100; // Adjust as needed
//     const watermarkHeight = 100; // Adjust as needed
//     const watermarkX = (doc.internal.pageSize.width - watermarkWidth) / 2; // Centered horizontally
//     const watermarkY = doc.internal.pageSize.height / 4; // Above half of the page

//     // Save the current graphic state, apply opacity, and restore graphic state
//     doc.saveGraphicsState();
//     doc.setGState(new doc.GState({ opacity: watermarkOpacity }));

//     // Add the watermark image
//     doc.addImage(watermarkImageData, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);

//     // Restore graphics state
//     doc.restoreGraphicsState();


    
    
  
//     // Add heading
//     doc.setFontSize(20);
//     doc.setTextColor(0, 0, 0); // Black text
//     doc.text('RaDix', 105, 70, null, null, 'center');
  
//     // Add contact email
//     doc.setFontSize(12);
//     doc.text('Contact: 108radix@gmail.com', 105, 80, null, null, 'center');
  
//     // Add timestamp
//     const timestamp = new Date().toLocaleString();
//     doc.setFontSize(10);
//     doc.text(`Downloaded on: ${timestamp}`, 105, 90, null, null, 'center');
  
//     // Add separator line
//     doc.line(10, 100, 200, 100);
  
//     // Add user details (left side)
//     if (userInfo) {
//       doc.setFontSize(12);
//       doc.text(`Name: ${userInfo.name}`, 20, 110);
//       doc.text(`Age: ${userInfo.age}`, 20, 120);
//       doc.text(`Weight: ${userInfo.weight}`, 20, 130);
//       doc.text(`Height: ${userInfo.height}`, 20, 140);
//     }
  
//     // Add report details (left side)
//     doc.text(`Report ID: ${report.id}`, 20, 150);
//     doc.text(`Class: ${report.class}`, 20, 160);
//     doc.text(`Advice: ${report.advice}`, 20, 170);
  
//     // Add tags (right side under the first break line)
//     doc.text("Tags:", 120, 110);
//     if (Array.isArray(report.tags)) {
//       report.tags.forEach((tag, index) => {
//         doc.text(`${index + 1}. ${tag}`, 120, 120 + index * 10);
//       });
//     } else {
//       doc.text("No tags available.", 120, 120);
//     }
  
//     // Add another separator line
//     doc.line(10, 180, 200, 180);
  
//     // Add image centered on the sheet
//     if (report.image) {
//       const image = await fetch(report.image).then((res) => res.blob());
//       const imageData = await new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result);
//         reader.readAsDataURL(image);
//       });
  
//       // Center image on the page
//       const imgX = 40; // Horizontal margin
//       const imgY = 190; // Starting Y position for image
//       const imgWidth = 130;
//       const imgHeight = 100; // Adjust to fit proportions
  
//       doc.addImage(imageData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
//     }
  
//     // Save PDF with report ID
//     doc.save(`RaDix_Report_${report.id}.pdf`);
//   };
  
  
   

//   return (
//     <div className="view-reports-container">
//       <h2>Your Reports</h2>
//       <div className="reports-list">
//         {reports.map((report) => (
//           <div className="report-card" key={report.id}>
//             <div className="report-details">
//               <h3>Report ID: {report.id}</h3>
//               <p>
//                 <strong>Class:</strong> {report.class}
//               </p>
//               <p>
//                 <strong>Advice:</strong> {report.advice}
//               </p>
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
  const [loading, setLoading] = useState(true); // Added loading state

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
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchReportsAndUserInfo();
  }, [email]);

  const downloadPDF = async (report) => {
    const doc = new jsPDF();

    // Add background color
    doc.setFillColor(255, 255, 255); // Light orange
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

    // Add watermark logo
    const watermarkLogoPath = '/1000056406.png'; // Ensure this path is accessible in your React project

    const watermarkOpacity = 0.2;

    const watermarkImage = await fetch(watermarkLogoPath).then((res) => res.blob());
    const watermarkImageData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(watermarkImage);
    });

    // Set the watermark position and size
    const watermarkWidth = 100; // Adjust as needed
    const watermarkHeight = 100; // Adjust as needed
    const watermarkX = (doc.internal.pageSize.width - watermarkWidth) / 2; // Centered horizontally
    const watermarkY = doc.internal.pageSize.height / 4; // Above half of the page

    // Save the current graphic state, apply opacity, and restore graphic state
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: watermarkOpacity }));

    // Add the watermark image
    doc.addImage(watermarkImageData, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);

    // Restore graphics state
    doc.restoreGraphicsState();

    // Add heading
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0); // Black text
    doc.text('RaDix', 105, 70, null, null, 'center');

    // Add contact email
    doc.setFontSize(12);
    doc.text('Contact: 108radix@gmail.com', 105, 80, null, null, 'center');

    // Add timestamp
    const timestamp = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Downloaded on: ${timestamp}`, 105, 90, null, null, 'center');

    // Add separator line
    doc.line(10, 100, 200, 100);

    // Add user details (left side)
    if (userInfo) {
      doc.setFontSize(12);
      doc.text(`Name: ${userInfo.name}`, 20, 110);
      doc.text(`Age: ${userInfo.age}`, 20, 120);
      doc.text(`Weight: ${userInfo.weight}`, 20, 130);
      doc.text(`Height: ${userInfo.height}`, 20, 140);
    }

    // Add report details (left side)
    doc.text(`Report ID: ${report.id}`, 20, 150);
    doc.text(`Class: ${report.class}`, 20, 160);
    doc.text(`Advice: ${report.advice}`, 20, 170);

    // Add tags (right side under the first break line)
    doc.text('Tags:', 120, 110);
    if (Array.isArray(report.tags)) {
      report.tags.forEach((tag, index) => {
        doc.text(`${index + 1}. ${tag}`, 120, 120 + index * 10);
      });
    } else {
      doc.text('No tags available.', 120, 120);
    }

    // Add another separator line
    doc.line(10, 180, 200, 180);

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
      const imgY = 190; // Starting Y position for image
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
            {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">Fetching Data...</div>
        </div>
      ) : (
        <div className="reports-list">
          {reports.map((report) => (
            <div className="report-card" key={report.id}>
              <div className="report-details">
                <h3>Report ID: {report.id}</h3>
                <p>
                  <strong>Class:</strong> {report.class}
                </p>
                <p>
                  <strong>Advice:</strong> {report.confidence}
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
      )}

    </div>
  );
};

export default ViewReports;
