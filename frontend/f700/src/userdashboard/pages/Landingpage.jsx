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
import { Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Register from "../../Register";
import Login from "../../Login";
import Profile from "./Profile";

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
      {isAuthenticated && <Sidebar />}

      <div
        className="container mt-4"
        style={{ marginRight: isAuthenticated ? "260px" : "0" }}
      >
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <h2>Welcome to Dashboard</h2>
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Protected Routes */}
          {isAuthenticated && (
            <>
              <Route path="/profile" element={<Profile />} />
            </>
          )}
        </Routes>
      </div>
    </>
  );
};

export default Landingpage;
