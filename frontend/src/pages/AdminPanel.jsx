import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    skin_type: "",
    ingredients: "",
    stock: "",
    image_url: "",
  });
  const loadOrders = async () => {
    try {
      const res = await API.get("/api/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await API.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const load = async () => {
      if (activeTab === "orders") await loadOrders();
      if (activeTab === "products") await loadProducts();
    };
    load();
  }, [activeTab]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/api/orders/${orderId}/status`, { status });
      loadOrders();
    } catch {
      alert("Greška pri promeni statusa.");
    }
  };

  const handleProductSubmit = async () => {
    try {
      const data = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        ingredients: productForm.ingredients.split(",").map((i) => i.trim()),
      };
      if (editingProduct) {
        await API.put(`/api/products/${editingProduct._id}`, data);
      } else {
        await API.post("/api/products", data);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        skin_type: "",
        ingredients: "",
        stock: "",
        image_url: "",
      });
      loadProducts();
    } catch {
      alert("Greška pri čuvanju proizvoda.");
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Obrisati proizvod?")) return;
    try {
      await API.delete(`/api/products/${id}`);
      loadProducts();
    } catch {
      alert("Greška pri brisanju.");
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category || "",
      brand: product.brand || "",
      skin_type: product.skin_type || "",
      ingredients: product.ingredients?.join(", ") || "",
      stock: product.stock || "",
      image_url: product.image_url || "",
    });
    setShowProductForm(true);
  };

  const inputClass =
    "w-full border border-[#F0EFEA] px-3 py-2 text-xs focus:outline-none focus:border-[#222222] bg-white";

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased pb-24">
      <div className="text-center pt-12 pb-8">
        <h1 className="text-3xl font-normal tracking-wide text-[#222222] font-serif">
          Admin Panel
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#888888] mt-2">
          Upravljanje sistemom
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex border-b border-[#F0EFEA]">
          {["orders", "products"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[#222222] text-[#222222]"
                  : "text-[#888888] hover:text-[#222222]"
              }`}
            >
              {tab === "orders" ? "Porudžbine" : "Proizvodi"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-[#222222] mb-6">
              Sve porudžbine ({orders.length})
            </h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-[#F0EFEA] p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-[#222222]">
                        Porudžbina #{order.id}
                      </span>
                      <span className="text-xs text-[#888888] ml-4">
                        Korisnik #{order.user_id}
                      </span>
                      <span className="text-xs text-[#888888] ml-4">
                        {new Date(order.created_at).toLocaleDateString("sr-RS")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs font-semibold">
                        {order.total_price} RSD
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className="border border-[#F0EFEA] px-3 py-1.5 text-xs focus:outline-none focus:border-[#222222]"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-xs text-[#888888] text-center py-12">
                  Nema porudžbina.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              {products.some((p) => p.stock < 10) && (
                <div className="bg-red-50 border border-red-200 p-4 mb-6 text-xs text-red-600">
                  ⚠️ Upozorenje: {products.filter((p) => p.stock < 10).length}{" "}
                  proizvod(a) ima niske zalihe (ispod 10 komada)!
                </div>
              )}
              <h2 className="text-xs uppercase tracking-widest font-bold text-[#222222]">
                Proizvodi ({products.length})
              </h2>
              <button
                onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                  setProductForm({
                    name: "",
                    description: "",
                    price: "",
                    category: "",
                    brand: "",
                    skin_type: "",
                    ingredients: "",
                    stock: "",
                    image_url: "",
                  });
                }}
                className="bg-[#222222] text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-black transition-colors"
              >
                + Dodaj proizvod
              </button>
            </div>

            {showProductForm && (
              <div className="border border-[#F0EFEA] p-6 mb-8 bg-[#F9F9F9]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#222222] mb-6">
                  {editingProduct ? "Izmeni proizvod" : "Novi proizvod"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">
                      Naziv
                    </label>
                    <input
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">
                      Brend
                    </label>
                    <input
                      value={productForm.brand}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          brand: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">
                      Cena (RSD)
                    </label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">
                      Kategorija
                    </label>
                    <input
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">
                      Tip kože
                    </label>
                    <select
                      value={productForm.skin_type}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          skin_type: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="">Odaberi</option>
                      <option value="suva">Suva</option>
                      <option value="masna">Masna</option>
                      <option value="kombinovana">Kombinovana</option>
                      <option value="osetljiva">Osetljiva</option>
                      <option value="normalna">Normalna</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">
                      Zalihe
                    </label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          stock: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">
                      Opis
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className={inputClass + " resize-none"}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">
                      Sastojci (odvojeni zarezom)
                    </label>
                    <input
                      value={productForm.ingredients}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          ingredients: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">
                      URL slike
                    </label>
                    <input
                      value={productForm.image_url}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          image_url: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleProductSubmit}
                    className="bg-[#222222] text-white px-8 py-2 text-xs uppercase tracking-widest hover:bg-black transition-colors"
                  >
                    {editingProduct ? "Sačuvaj izmene" : "Dodaj proizvod"}
                  </button>
                  <button
                    onClick={() => setShowProductForm(false)}
                    className="border border-[#F0EFEA] px-8 py-2 text-xs uppercase tracking-widest hover:border-[#222222] transition-colors"
                  >
                    Otkaži
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border border-[#F0EFEA] p-4 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-contain mix-blend-multiply"
                      />
                    )}
                    <div>
                      <h3 className="text-xs font-bold text-[#222222]">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-[#888888]">
                        {product.brand} · {product.category} · {product.price}{" "}
                        RSD ·
                        <span
                          className={
                            product.stock < 10 ? "text-red-500 font-bold" : ""
                          }
                        >
                          Zalihe: {product.stock}{" "}
                          {product.stock < 10 ? "⚠️ Niske zalihe!" : ""}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => startEdit(product)}
                      className="text-[10px] uppercase tracking-widest text-[#888888] hover:text-[#222222] transition-colors"
                    >
                      Izmeni
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                    >
                      Obriši
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
