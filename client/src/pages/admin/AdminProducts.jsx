import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle, Search } from 'lucide-react';
import AdminNavbar from '../../components/AdminNavbar';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const categories = ['Skincare', 'Haircare', 'Makeup', 'Body Care', 'Fragrance', 'Personal Care'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Skincare',
    brand: '',
    price: '',
    stock: '',
    image: '',
    isActive: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products/admin/all');
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        price: product.price,
        stock: product.stock,
        image: product.image,
        isActive: product.isActive
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: 'Skincare',
        brand: '',
        price: '',
        stock: '',
        image: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF9FD]">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#834FD4] block">
              INVENTORY MANAGEMENT
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#171719] mt-1">
              Cosmetics Catalog & Stock
            </h1>
            <p className="text-xs text-[#6B6870] mt-1">
              Add new formulations, update pricing, manage warehouse stock, and toggle visibility
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white font-semibold text-xs shadow-soft transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-[#E11D48] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Search bar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by name, brand, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#E8E3EF] rounded-full focus:outline-none focus:ring-2 focus:ring-[#9B6DE3] shadow-card placeholder-[#6B6870]"
          />
          <Search className="w-4 h-4 text-[#6B6870] absolute left-3.5 top-3" />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-[#E8E3EF] shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9FD] text-[#6B6870] uppercase font-semibold border-b border-[#E8E3EF]">
                <tr>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Warehouse Stock</th>
                  <th className="px-6 py-4">Visibility</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F1FB]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-[#6B6870]">
                      Loading catalog items...
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-[#FAF9FD]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover bg-[#FAF9FD] shrink-0 border border-[#E8E3EF]"
                          />
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#834FD4] block">
                              {p.brand}
                            </span>
                            <span className="font-bold text-sm text-[#171719] line-clamp-1">{p.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#6B6870] font-medium">{p.category}</td>
                      <td className="px-6 py-4 font-bold text-[#171719]">{formatPrice(p.price)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-semibold px-2.5 py-1 rounded-full text-[11px] ${
                            p.stock > 5
                              ? 'bg-[#EBF3EC] text-[#50805C] border border-[#D1E6D4]'
                              : p.stock > 0
                              ? 'bg-[#FBEFE6] text-[#B86B3E] border border-[#F5DAC7]'
                              : 'bg-rose-50 text-[#E11D48] border border-rose-200'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                            p.isActive
                              ? 'bg-[#EDE5F8] text-[#834FD4] border border-[#DFCFF4]'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {p.isActive ? 'Active in Store' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(p)}
                            className="p-2 text-[#6B6870] hover:text-[#834FD4] hover:bg-[#EDE5F8] rounded-xl transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-2 text-[#6B6870] hover:text-[#E11D48] hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-[#6B6870]">
                      No products matching search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 space-y-5 shadow-soft border border-[#E8E3EF] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F6F1FB] pb-4">
              <h3 className="font-bold text-[#171719] text-lg">
                {editingProduct ? 'Edit Cosmetics Formulation' : 'Add New Formulation'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 text-[#6B6870] hover:text-[#171719] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#171719] mb-1.5">Product Title *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Hydrating Glow Serum"
                  className="w-full px-4 py-2.5 bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#171719] mb-1.5">Brand Name *</label>
                  <input
                    type="text"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Lumina Pure"
                    className="w-full px-4 py-2.5 bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#171719] mb-1.5">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#171719] mb-1.5">Price (LKR) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="3800"
                    className="w-full px-4 py-2.5 bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#171719] mb-1.5">Stock Count *</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="25"
                    className="w-full px-4 py-2.5 bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#171719] mb-1.5">Image URL *</label>
                <input
                  type="url"
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#171719] mb-1.5">Description & Active Ingredients *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nourishing botanical formulation..."
                  className="w-full px-4 py-2.5 bg-[#FAF9FD] border border-[#E8E3EF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B6DE3]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="rounded text-[#9B6DE3] focus:ring-[#9B6DE3] accent-[#9B6DE3]"
                />
                <label htmlFor="isActive" className="font-semibold text-[#171719]">
                  Product is Active & visible in customer store
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F6F1FB]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-full border border-[#E8E3EF] text-[#6B6870] hover:bg-[#FAF9FD] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#9B6DE3] hover:bg-[#834FD4] text-white font-bold transition-colors shadow-soft"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
