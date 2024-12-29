// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// const path = require("path");
// const axios = require("axios");
// const fs = require("fs");
// const FormData = require("form-data");

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.static("uploads"));

// // Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });
// const upload = multer({ storage });

// // Endpoint to upload the image and send it to the Python API
// app.post("/upload", upload.single("file"), async (req, res) => {
//   const filePath = path.join(__dirname, "uploads", req.file.filename);

//   try {
//     const formData = new FormData();
//     formData.append("file", fs.createReadStream(filePath));

//     const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
//       headers: formData.getHeaders(),
//     });

//     fs.unlinkSync(filePath); // Clean up uploaded file

//     res.json({
//       prediction: response.data.prediction,
//       file: req.file.filename,
//     });
//   } catch (error) {
//     console.error("Error during prediction:", error.message || error.response?.data || error);
//     res.status(500).json({
//       error: error.response?.data?.error || error.message || "Prediction failed.",
//     });
//   }
// });


// // Start the server
// app.listen(5002, () => {
//   console.log("Node.js server running on port 5002");
//   console.log("Ensure that Flask server is running on port 5000");
// });



const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const admin = require("firebase-admin");

const serviceAccount = require("./radix-3abe9-firebase-adminsdk-ro1xz-52ab5b1eb0.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.file.filename);

  try {
    const email = req.headers.email;
    if (!email) {
      throw new Error("User email not provided in the request headers.");
    }

    const userDocRef = db.collection("login").doc(email);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      throw new Error("User does not exist in Firestore.");
    }
    const userType = userDoc.data().userType;

    console.log("User email:", email);
    console.log("User type:", userType);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    let apiUrl;
    if (userType.toLowerCase() === "doctor") {  // Ensure case-insensitivity
      apiUrl = "http://127.0.0.1:5001/tags";  // Ensure this matches your Flask server URL
    } else {
      apiUrl = "http://127.0.0.1:5000/predict";
    }

    console.log("API URL:", apiUrl);

    const response = await axios.post(apiUrl, formData, {
      headers: formData.getHeaders(),
    });

    fs.unlinkSync(filePath); // Delete the file after processing

    if (userType.toLowerCase() === "doctor") {  
      res.json({
        prediction: response.data.prediction || "Unknown",
        tags: Array.isArray(response.data.tags) ? response.data.tags : Object.entries(response.data.tags),
        file: req.file.filename,
      });
    } else {
      res.json({
        prediction: response.data.prediction,
        file: req.file.filename,
      });
    }

    
  } catch (error) {
    console.error("Error during prediction:", error.message || error.response?.data || error);
    res.status(500).json({
      error: error.response?.data?.error || error.message || "Prediction failed.",
    });
  }
});

app.listen(5002, () => {
  console.log("Node.js server running on port 5002");
  console.log("Ensure that Flask servers are running on ports 5000 and 5001");
  
});
