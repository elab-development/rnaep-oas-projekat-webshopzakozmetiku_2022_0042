import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Recommendations() {
  const [products, setProducts] = useState([]);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        let productIds = [];

        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.id;

          try {
            const res = await API.get(
              `/api/recommendations/personalized/${userId}`,
            );
            productIds =
              res.data.recommendedProducts?.map((p) => p.productId) || [];
            if (productIds.length > 0) setIsPersonalized(true);
          } catch {
            //
          }
        }

        if (productIds.length === 0) {
          const res = await API.get("/api/recommendations/general");
          productIds = res.data.flatMap((rec) =>
            rec.recommendedProducts.map((p) => p.productId),
          );
        }

        const productsRes = await API.get("/api/products");
        const productDetails = productIds
          .map((id) => productsRes.data.find((p) => p._id === id))
          .filter(Boolean);

        setProducts(productDetails);
      } catch (err) {
        console.error(err);
      }
    };

    loadRecommendations();
  }, [user]);

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased pb-24">
      <div className="text-center pt-12 pb-16">
        <h1 className="text-3xl md:text-4xl font-normal tracking-wide text-[#222222] mb-3 font-serif">
          {isPersonalized
            ? "Recommended For You"
            : "Other Customers Also Bought"}
        </h1>
        <div className="flex items-center justify-center space-x-2 text-[11px] uppercase tracking-widest text-[#888888]">
          <span className="hover:text-[#222222] cursor-pointer">Glow.</span>
          <span>/</span>
          <span className="hover:text-[#222222] cursor-pointer">Curated</span>
          <span>/</span>
          <span className="text-[#222222] font-medium">
            {isPersonalized ? "Personalized" : "Trending"}
          </span>
        </div>
        <p className="text-xs text-[#888888] font-light tracking-wide mt-4 max-w-md mx-auto leading-relaxed">
          {isPersonalized
            ? "Na osnovu vaših prethodnih pretraga, kupovina i jedinstvenog profila kože."
            : "Najpopularniji proizvodi koje naša zajednica trenutno najviše bira i voli."}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <div
              key={product._id}
              className="group relative flex flex-col justify-between"
            >
              <div className="relative aspect-3/4 w-full bg-[#F9F9F9] flex items-center justify-center p-8 overflow-hidden rounded-xs">
                <button className="absolute top-4 right-4 text-[#888888] hover:text-[#222222] transition-colors z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-4.5 h-4.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </button>

                <Link
                  to={`/product/${product._id}`}
                  className="w-full h-full flex items-center justify-center"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-102 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-[10px] tracking-widest text-[#C8C2B9] uppercase font-light">
                      glow. recommendation
                    </div>
                  )}
                </Link>
              </div>

              <div className="text-center pt-4 flex flex-col items-center grow justify-between">
                <div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#222222]">
                    {product.brand || "GLOW."}
                  </h3>

                  <p className="text-xs text-[#555555] font-light mt-1 max-w-50 mx-auto line-clamp-2 leading-relaxed">
                    {product.name}
                  </p>

                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <div className="text-[10px] text-[#222222] tracking-tighter">
                      ★★★★★
                    </div>
                    <span className="text-[10px] text-[#888888] font-light">
                      (182 reviews)
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs font-semibold text-[#222222]">
                  {product.price} RSD
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
