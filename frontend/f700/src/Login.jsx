// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function Login({ onLoginSuccess }) {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // 🔹 changed port to 5000
//       const res = await fetch("http://localhost:7000/user/loginuser", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await res.json();
//       console.log("Server Response:", data);

//       if (res.ok && data.token) {
//         alert("Login successful!");
//         localStorage.setItem("logintoken", data.token);

//         setFormData({ email: "", password: "" });

//         if (onLoginSuccess) {
//           onLoginSuccess(); // ✅ notify Landingpage.jsx
//         }

//         navigate("/"); // ✅ go to dashboard
//       } else {
//         alert(data.error || "Something went wrong");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Could not connect to the server");
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100">
//       <div className="card p-4 shadow" style={{ width: "400px" }}>
//         <h2 className="mb-4 text-center">Please Login</h2>

//         <form onSubmit={handleSubmit} className="register-form">
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">Email address</label>
//             <input
//               type="email"
//               className="form-control"
//               id="email"
//               name="email"
//               placeholder="name@example.com"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="password" className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               id="password"
//               name="password"
//               placeholder="Enter Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-100">
//             Login
//           </button>
//         </form>

//         <p className="mt-3 text-center">
//           Don’t have an account? <Link to="/register">Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5700/user/loginuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Server Response:", data);

      if (res.ok && data.token) {
        alert("Login successful!");
        localStorage.setItem("logintoken", data.token);
        if (data.username) {
          localStorage.setItem("username", data.username);
        }
        if (data.role) {
          localStorage.setItem("role", data.role);
        }

        setFormData({ email: "", password: "" });

        if (onLoginSuccess) onLoginSuccess();
        // After login, ask which portal to continue with, but enforce registered role on that page
        navigate('/choose-role');
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to the server");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="mb-4 text-center">Please Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <p className="mt-3 text-center">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
