// src/components/DepartmentsList.js
import React, { useEffect, useState } from 'react';
import { fetchDepartments } from '../api';
import { Link } from 'react-router-dom';

const DepartmentsList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments()
      .then(data => setDepartments(data.data))
      .catch(() => setError('Failed to load departments'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5">Loading departments...</div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <div className="container my-5">
      <h2>All Departments</h2>
      <ul className="list-group mt-4">
        {departments.map(dept => (
          <li key={dept._id} className="list-group-item">
            <Link to={`/department/${dept.name.toLowerCase()}`} className="text-decoration-none">
              {dept.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentsList;
