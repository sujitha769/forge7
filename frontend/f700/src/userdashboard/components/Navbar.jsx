// import React from "react";
// import { Link } from "react-router-dom";

// const Navbar = ({ isAuthenticated, onLogout }) => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 fixed-top">
//       <Link className="navbar-brand" to="/">
//         MyApp
//       </Link>

//       <div className="ms-auto">
//         {!isAuthenticated ? (
//           <>
//             <Link to="/login" className="btn btn-outline-light me-2">
//               Login
//             </Link>
//             <Link to="/register" className="btn btn-light">
//               Register
//             </Link>
//           </>
//         ) : (
//           <button onClick={onLogout} className="btn btn-danger">
//             Logout
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 fixed-top">
      <Link className="navbar-brand" to="/">
        MyApp
      </Link>

      <div className="ms-auto">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="btn btn-outline-light me-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-light">
              Register
            </Link>
          </>
        ) : (
          <button onClick={onLogout} className="btn btn-danger">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
