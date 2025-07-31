const API_BASE = '/api'; // Make sure backend is running on this

export async function fetchProducts(page = 1, limit = 10) {
  const response = await fetch(`${API_BASE}/products?limit=${limit}&page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function fetchProductById(id) {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Product not found');
    else throw new Error('Failed to fetch product');
  }
  return response.json();
}


export async function fetchDepartments() {
  const response = await fetch('/api/departments');
  console.log('Departments response status:', response.status);
  if (!response.ok) {
    throw new Error('Failed to fetch departments');
  }
  const data = await response.json();
  console.log('Departments data:', data);
  return data;
}

export async function fetchProductsByDepartmentId(deptId) {
  const response = await fetch(`${API_BASE}/departments/${deptId}/products`);

  if (!response.ok) {
    throw new Error('Failed to fetch products by department');
  }
  return response.json();
}
