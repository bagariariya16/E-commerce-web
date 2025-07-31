import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import DepartmentPage from './components/DepartmentPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/department/:name" element={<DepartmentPage />} />
        <Route path="*" element={<div className="text-center mt-5">404 - Page Not Found</div>} />
      </Routes>

    </Router>
  );
}

export default App;
