// // Sidebar.jsx
// import React from "react";
// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   return (
//     <div
//       className="d-flex flex-column bg-light border-start vh-100 p-3"
//       style={{ width: "250px", position: "fixed", top: "56px", right: 0 }}
//     >
//       <h5 className="mb-4">Dashboard</h5>

//       <Link to="/addpost" className="nav-link text-dark mb-2">
//         ➕ Add Post
//       </Link>
//       <Link to="/allposts" className="nav-link text-dark mb-2">
//         📋 My Posts
//       </Link>
//     </div>
//   );
// };

// export default Sidebar;



import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column bg-light border-start vh-100 p-3"
      style={{ width: "250px", position: "fixed", top: "56px", right: 0 }}
    >
      <h5 className="mb-4">Dashboard</h5>

      <Link to="/profile" className="nav-link text-dark mb-2">
        👤 Profile
      </Link>
      <Link to="/my-bookings" className="nav-link text-dark mb-2">
        📅 My Bookings
      </Link>
      <Link to="/my-prescription" className="nav-link text-dark mb-2">
        💊 My Prescription
      </Link>
      <Link to="/my-reports" className="nav-link text-dark mb-2">
        📊 My Reports
      </Link>
      <Link to="/settings" className="nav-link text-dark mb-2">
        ⚙️ Settings
      </Link>
    </div>
  );
};

export default Sidebar;
