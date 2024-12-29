

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

  const downloadPDF = async (report) => {
    const doc = new jsPDF();
  
    // Add background color
    doc.setFillColor(255, 255, 255); // Light orange
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
    // Add watermark logo
    const watermarkLogoPath = '/1000056406.png'; // Ensure this path is accessible in your React project
  
    
    
  
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
    doc.text("Tags:", 120, 110);
    if (Array.isArray(report.tags)) {
      report.tags.forEach((tag, index) => {
        doc.text(`${index + 1}. ${tag}`, 120, 120 + index * 10);
      });
    } else {
      doc.text("No tags available.", 120, 120);
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

//     // Add report details
//     doc.setFontSize(14);
//     doc.text("Report Details", 10, 20);

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

//     // Add user details
//     if (userInfo) {
//       doc.setFontSize(12);
//       doc.text(`Name: ${userInfo.name}`, 20, 110);
//       doc.text(`Age: ${userInfo.age}`, 20, 120);
//       doc.text(`Weight: ${userInfo.weight}`, 20, 130);
//       doc.text(`Height: ${userInfo.height}`, 20, 140);
//     }

//     // Add report details
//     doc.text(`Report ID: ${report.id}`, 20, 150);
//     doc.text(`Class: ${report.class}`, 20, 160);
//     doc.text(`Advice: ${report.advice}`, 20, 170);

//     // Include tags if userType is Doctor
//     if (userInfo?.userType === "Doctor") {
//       doc.text("Tags:", 110, 40);
//       if (Array.isArray(report.tags)) {
//         report.tags.forEach((tag, index) => {
//           doc.text(`${index + 1}. ${tag}`, 110, 50 + index * 10);
//         });
//       } else {
//         doc.text("No tags available.", 110, 50);
//       }
//     } else {
//       // Include class and confidence for other user types
//       doc.text(`Class: ${report.class || "N/A"}`, 110, 40);
//       doc.text(`Confidence: ${report.confidence || "N/A"}`, 110, 50);
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
//             <div className="report-details-left">
//               <h3>Report ID: {report.id}</h3>
//               <p>
//                 <strong>Class:</strong> {report.class}
//               </p>
//               <p>
//                 <strong>Advice:</strong> {report.advice}
//               </p>
//             </div>
//             <div className="report-details-right">
//               {userInfo?.userType === "Doctor" ? (
//                 <>
//                   <h4>Tags:</h4>
//                   {Array.isArray(report.tags) ? (
//                     report.tags.map((tag, index) => (
//                       <p key={index}>{tag}</p>
//                     ))
//                   ) : (
//                     <p>No tags available</p>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <p><strong>Confidence:</strong> {report.confidence || "N/A"}</p>
//                   <p><strong>Class:</strong> {report.class || "N/A"}</p>
//                 </>
//               )}
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
