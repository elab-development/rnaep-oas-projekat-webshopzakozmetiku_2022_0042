import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("100ml");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    API.get("/api/products")
      .then((res) => {
        const found = res.data.find((p) => p._id === id);
        setProduct(found || res.data[0]);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    if (id) {
      API.get(`/api/reviews/${id}`)
        .then((res) => setReviews(res.data))
        .catch(() => {});
    }
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await API.post("/api/orders/cart", {
          product_id: product._id,
          quantity: 1,
          price: product.price,
        });
      } else {
        // Guest - čuvaj u localStorage
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const existing = guestCart.find((i) => i.product_id === product._id);
        if (existing) {
          existing.quantity += 1;
        } else {
          guestCart.push({
            product_id: product._id,
            quantity: 1,
            price: product.price,
          });
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      }
      alert("Proizvod je uspešno dodat u vašu torbu.");
    } catch {
      alert("Greška pri dodavanju u korpu.");
    }
  };

  const submitReview = async () => {
    try {
      await API.post("/api/reviews", {
        product_id: id,
        rating,
        comment,
      });
      const res = await API.get(`/api/reviews/${id}`);
      setReviews(res.data);
      setComment("");
      setRating(5);
    } catch {
      alert("Greška pri ostavljanju recenzije.");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-xs uppercase tracking-widest font-light text-[#888888] animate-pulse">
          Učitavanje detalja...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-12">
        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#888888]">
          <Link to="/" className="hover:text-[#222222] transition-colors">
            Glow.
          </Link>
          <span>/</span>
          <span className="hover:text-[#222222] transition-colors">
            {product.category || "Skincare"}
          </span>
          <span>/</span>
          <span className="text-[#222222] font-medium truncate max-w-37.5">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
          <div className="md:col-span-6">
            <div className="relative aspect-3/4 w-full bg-[#F9F9F9] flex items-center justify-center p-12 overflow-hidden rounded-xs border border-[#F0EFEA]/40">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-102"
                />
              ) : (
                <div className="text-[11px] tracking-widest text-[#C8C2B9] uppercase font-light">
                  Image coming soon
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-6 flex flex-col justify-start pt-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[#222222] mb-3 block">
              {product.brand || "GLOW. LABORATORIES"}
            </span>

            <h1 className="text-3xl lg:text-4xl font-normal tracking-wide text-[#222222] font-serif mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center space-x-2 mb-6">
              <span className="text-xs text-[#222222] tracking-tighter">
                ★★★★★
              </span>
              <span className="text-[11px] text-[#888888] font-light">
                ({reviews.length} recenzija)
              </span>
            </div>

            <p className="text-xl font-semibold text-[#222222] mb-8 font-mono tracking-tight">
              {product.price} RSD
            </p>

            <p className="text-xs lg:text-sm text-[#555555] font-light leading-relaxed mb-8 max-w-xl">
              {product.description}
            </p>

            <div className="border-t border-[#F0EFEA] pt-6 space-y-6">
              <div>
                <span className="block text-[10px] font-bold tracking-widest uppercase text-[#222222] mb-3">
                  Select Volume
                </span>
                <div className="flex space-x-2">
                  {["30ml", "100ml", "200ml"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-[11px] uppercase tracking-wider font-medium transition-all border ${
                        selectedSize === size
                          ? "border-[#222222] bg-[#222222] text-white"
                          : "border-[#EAE9E4] bg-white text-[#666666] hover:border-[#222222]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {product.skin_type && (
                  <div>
                    <span className="block text-[10px] font-bold tracking-widest uppercase text-[#888888] mb-1">
                      Skin Type
                    </span>
                    <span className="text-xs text-[#222222] font-light capitalize">
                      {product.skin_type} koža
                    </span>
                  </div>
                )}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div>
                    <span className="block text-[10px] font-bold tracking-widest uppercase text-[#888888] mb-1">
                      Key Assets
                    </span>
                    <span className="text-xs text-[#222222] font-light truncate block max-w-50">
                      {product.ingredients[0]},{" "}
                      {product.ingredients[1] || "prirodni ekstrakti"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={addToCart}
                className="w-full bg-[#222222] text-white py-4 text-xs font-medium uppercase tracking-widest hover:bg-black transition-colors duration-300"
              >
                Add To Shopping Bag
              </button>
              <span className="text-[10px] uppercase tracking-widest text-[#BBBBBB] font-light block text-center mt-3">
                ✓ Besplatna dostava na vašu adresu za sve porudžbine
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-24 pt-16 border-t border-[#F0EFEA]">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-normal tracking-wide text-[#222222] font-serif mb-2">
            Verified Customer Reviews
          </h2>
          <p className="text-xs text-[#888888] font-light uppercase tracking-widest">
            Iskustva naše zajednice
          </p>
        </div>

        {localStorage.getItem("token") && (
          <div className="bg-[#F9F9F9] border border-[#F0EFEA] p-6 mb-8">
            <h3 className="text-xs font-bold tracking-widest uppercase text-[#222222] mb-4">
              Ostavite recenziju
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                  Ocena
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border border-[#F0EFEA] px-3 py-2 text-xs bg-white"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                  Komentar
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full border border-[#F0EFEA] px-3 py-2 text-xs bg-white resize-none"
                />
              </div>
              <button
                onClick={submitReview}
                className="bg-[#222222] text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-black transition-colors"
              >
                Objavi recenziju
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-[#F9F9F9] border border-[#F0EFEA] p-6"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold tracking-widest uppercase text-[#222222]">
                    Kupac #{review.user_id}
                  </span>
                  <span className="text-xs text-[#222222]">
                    {"★".repeat(review.rating)}
                  </span>
                </div>
                <p className="text-xs text-[#555555] font-light leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-[#F9F9F9] border border-[#F0EFEA] border-dashed">
              <p className="text-xs text-[#888888] font-light uppercase tracking-widest">
                Nema recenzija. Budite prvi koji će ostaviti utisak.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
