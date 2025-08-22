// import React, { useEffect, useState } from "react";
// import { Routes, Route, useNavigate } from "react-router-dom";

// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import Register from "../../Register";
// import Login from "../../Login";
// import AddPost from "../../Addpost";
// import Allposts from "../../Allposts"; // ✅ fixed name

// const Landingpage = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // ✅ Check token on mount
//     const token = localStorage.getItem("logintoken");
//     if (token) {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const handleLoginSuccess = () => {
//     setIsAuthenticated(true);
//     navigate("/"); // redirect to dashboard
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("logintoken");
//     setIsAuthenticated(false);
//     navigate("/login");
//   };

//   return (
//     <>
//       {/* ✅ Navbar always visible */}
//       <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

//       {/* ✅ Sidebar only if logged in */}
//       {isAuthenticated && <Sidebar />}

//       <div
//         className="container mt-4"
//         style={{ marginRight: isAuthenticated ? "260px" : "0" }}
//       >
//         <Routes>
//           {/* ✅ If not logged in, show login page instead of dashboard */}
//           <Route
//             path="/"
//             element={
//               isAuthenticated ? (
//                 <h2>Welcome to Dashboard</h2>
//               ) : (
//                 <Login onLoginSuccess={handleLoginSuccess} />
//               )
//             }
//           />

//           <Route path="/register" element={<Register />} />
//           <Route
//             path="/login"
//             element={<Login onLoginSuccess={handleLoginSuccess} />}
//           />

//           {/* ✅ Protected Routes */}
//           {isAuthenticated && (
//             <>
//               <Route path="/addpost" element={<AddPost />} />
//               <Route path="/allposts" element={<Allposts />} />
//               {/* <Route path="/post/:id" element={<PostDetails />} /> */}
//             </>
//           )}
//         </Routes>
//       </div>
//     </>
//   );
// };

// export default Landingpage;




import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DoctorSidebar from "../components/DoctorSidebar";
import Register from "../../Register";
import Login from "../../Login";
import Profile from "./Profile";
import RegisterChoice from "./RegisterChoice";
import DoctorRegister from "./DoctorRegister";
import MyBookings from "./MyBookings";
import DoctorOverview from "./DoctorOverview";
import DoctorAppointments from "./DoctorAppointments";
import DoctorPatients from "./DoctorPatients";
import DoctorPrescriptions from "./DoctorPrescriptions";
import DoctorSettings from "./DoctorSettings";
import ChooseRole from "./ChooseRole";
import RequireRole from "../components/RequireRole";
import MyPrescriptions from "./MyPrescriptions";
import MyReports from "./MyReports";
import Settings from "./Settings";

const Landingpage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("logintoken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("logintoken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      {isAuthenticated && window.location.pathname !== '/choose-role' && (
        localStorage.getItem('role') === 'doctor' ? <DoctorSidebar /> : <Sidebar />
      )}

      <div
        className="container mt-4"
        style={{ marginRight: isAuthenticated ? "260px" : "0" }}
      >
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                localStorage.getItem('role') === 'doctor' ? (
                  <Navigate to="/doctor/overview" replace />
                ) : (
                  <Navigate to="/profile" replace />
                )
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          <Route path="/register" element={<RegisterChoice />} />
          <Route path="/register-client" element={<Register />} />
          <Route path="/register-doctor" element={<DoctorRegister />} />
          <Route path="/choose-role" element={<ChooseRole />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Protected Routes */}
          {isAuthenticated && (
            <>
              {localStorage.getItem('role') === 'doctor' ? (
                <>
                  <Route path="/doctor/overview" element={<RequireRole role="doctor"><DoctorOverview /></RequireRole>} />
                  <Route path="/doctor/appointments" element={<RequireRole role="doctor"><DoctorAppointments /></RequireRole>} />
                  <Route path="/doctor/patients" element={<RequireRole role="doctor"><DoctorPatients /></RequireRole>} />
                  <Route path="/doctor/prescriptions" element={<RequireRole role="doctor"><DoctorPrescriptions /></RequireRole>} />
                  <Route path="/doctor/settings" element={<RequireRole role="doctor"><DoctorSettings /></RequireRole>} />
                </>
              ) : (
                <>
                  <Route path="/profile" element={<RequireRole role="client"><Profile /></RequireRole>} />
                  <Route path="/my-bookings" element={<RequireRole role="client"><MyBookings /></RequireRole>} />
                  <Route path="/my-prescription" element={<RequireRole role="client"><MyPrescriptions /></RequireRole>} />
                  <Route path="/my-reports" element={<RequireRole role="client"><MyReports /></RequireRole>} />
                  <Route path="/settings" element={<RequireRole role="client"><Settings /></RequireRole>} />
                </>
              )}
            </>
          )}
        </Routes>
      </div>
    </>
  );
};

export default Landingpage;
