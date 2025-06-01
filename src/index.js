import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import Footer from "./components/Footer";
import "./styles/Navbar.css";
import "./styles/Footer.css";
import "./styles/App.css";
import Navbar from './components/Navbar';
import { AuthProvider } from './AuthContext';

const RootComponent = () => {
  return (
    <React.StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />
            <main>
              <App />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RootComponent />);
