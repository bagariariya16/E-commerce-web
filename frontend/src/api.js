const API_BASE = 'http://localhost:5000/api'; // Make sure backend is running on this

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
