// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { fetchDepartments } from '../api';

const Navbar = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments()
      .then(data => setDepartments(data.data))
      .catch(() => setDepartments([]));
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Ecommerce</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink exact="true" to="/" className="nav-link" activeclassname="active">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/departments" className="nav-link" activeclassname="active">
                Departments
              </NavLink>
            </li>

            {/* Departments Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#!"
                id="departmentsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Browse Departments
              </a>
              <ul className="dropdown-menu" aria-labelledby="departmentsDropdown">

                {departments.length === 0 && (
                  <li className="dropdown-item text-muted">No departments</li>
                )}

                {departments.map(dept => (
                  <li key={dept._id}>
                    <Link
                      className="dropdown-item"
                      to={`/department/${dept.name.toLowerCase()}`}
                    >
                      {dept.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
