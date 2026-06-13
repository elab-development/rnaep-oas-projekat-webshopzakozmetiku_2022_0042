import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Cart() {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestItems, setGuestItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (user) {
          const cartRes = await API.get("/api/orders/cart");
          const items = cartRes.data;
          const productsRes = await API.get("/api/products");
          const itemsWithDetails = items.map((item) => {
            const product = productsRes.data.find(
              (p) => p._id === item.product_id,
            );
            return {
              ...item,
              name: product?.name || "Nepoznat proizvod",
              brand: product?.brand || "GLOW. COLLAB",
              image_url: product?.image_url,
              price: item.price || product?.price || 0,
            };
          });
          setCartItems(itemsWithDetails);
        } else {
          const stored = JSON.parse(localStorage.getItem("guestCart") || "[]");
          const productsRes = await API.get("/api/products");
          const itemsWithDetails = stored.map((item) => {
            const product = productsRes.data.find(
              (p) => p._id === item.product_id,
            );
            return {
              ...item,
              name: product?.name || "Nepoznat proizvod",
              brand: product?.brand || "GLOW. COLLAB",
              image_url: product?.image_url,
              price: item.price || product?.price || 0,
            };
          });
          setGuestItems(itemsWithDetails);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadCart();
  }, [user]);

  const applyPromoCode = async () => {
    try {
      const res = await API.post("/api/campaigns/promo/validate", {
        code: promoCode,
      });
      setDiscount(res.data.discount_value);
      setPromoMessage(
        `Promo kod primenjen! Popust: ${res.data.discount_value} RSD`,
      );
    } catch {
      setPromoMessage("Nevažeći promo kod.");
      setDiscount(0);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (user) {
        await API.delete(`/api/orders/cart/${itemId}`);
        setCartItems(cartItems.filter((item) => item.id !== itemId));
      } else {
        const stored = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const updated = stored.filter((i) => i.product_id !== itemId);
        localStorage.setItem("guestCart", JSON.stringify(updated));
        setGuestItems(guestItems.filter((i) => i.product_id !== itemId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const displayItems = user ? cartItems : guestItems;
  const totalPrice = displayItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const finalPrice = Math.max(0, totalPrice - discount);

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased pb-24">
      <div className="text-center pt-12 pb-16">
        <h1 className="text-3xl md:text-4xl font-normal tracking-wide text-[#222222] mb-3 font-serif">
          Your Shopping Bag
        </h1>
        <div className="flex items-center justify-center space-x-2 text-[11px] uppercase tracking-widest text-[#888888]">
          <Link to="/" className="hover:text-[#222222]">
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#222222] font-medium">Cart Overview</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {displayItems.length === 0 ? (
          <div className="bg-[#F9F9F9] p-16 text-center rounded-xs border border-[#F0EFEA]">
            <p className="text-xs uppercase tracking-widest text-[#888888] font-light">
              Vaša korpa je trenutno prazna.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block bg-[#222222] text-white text-[10px] uppercase tracking-widest px-8 py-3.5 font-medium hover:bg-black transition-colors"
            >
              Nastavi Kupovinu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="border-b border-[#F0EFEA] pb-3">
                <span className="text-xs uppercase tracking-widest font-bold text-[#222222]">
                  Stavke ({displayItems.length})
                </span>
              </div>

              {displayItems.map((item) => (
                <div
                  key={item.id || item.product_id}
                  className="flex items-center space-x-4 pb-6 border-b border-[#F0EFEA] last:border-none"
                >
                  <div className="w-20 h-24 bg-[#F9F9F9] flex items-center justify-center p-2 rounded-xs shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                      />
                    ) : (
                      <span className="text-[8px] text-[#C8C2B9] tracking-tighter uppercase font-light text-center">
                        No image
                      </span>
                    )}
                  </div>

                  <div className="grow flex justify-between items-start">
                    <div>
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#888888]">
                        {item.brand}
                      </h4>
                      <h3 className="text-xs font-light text-[#222222] mt-0.5 max-w-55 line-clamp-2 leading-relaxed">
                        {item.name}
                      </h3>
                      <div className="mt-3 flex items-center space-x-2 text-[11px] text-[#666666]">
                        <span className="font-light">Količina:</span>
                        <span className="font-medium text-[#222222] bg-[#F9F9F9] px-2 py-0.5 border border-[#EAE9E4] text-[10px]">
                          {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 shrink-0">
                      <div className="text-xs font-semibold text-[#222222]">
                        {item.price * item.quantity} RSD
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item.id || item.product_id)
                        }
                        className="text-[10px] uppercase tracking-widest text-[#888888] hover:text-[#222222] transition-colors"
                      >
                        Ukloni
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 sticky top-24">
              <div className="border border-[#F0EFEA] p-6 bg-white shadow-xs">
                <h3 className="text-xs font-bold tracking-widest uppercase text-[#222222] mb-6 pb-2 border-b border-[#F0EFEA]">
                  Order Summary
                </h3>

                {/* Guest email */}
                {!user && (
                  <div className="mb-6">
                    <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-2">
                      Email adresa
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="vas@email.com"
                      className="w-full border border-[#F0EFEA] px-3 py-2 text-xs focus:outline-none focus:border-[#222222]"
                    />
                  </div>
                )}

                {/* Promo kod */}
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo kod"
                      className="flex-1 border border-[#F0EFEA] px-3 py-2 text-xs focus:outline-none focus:border-[#222222]"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="bg-[#222222] text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-black transition-colors"
                    >
                      Primeni
                    </button>
                  </div>
                  {promoMessage && (
                    <p
                      className={`text-[10px] mt-2 ${discount > 0 ? "text-green-600" : "text-red-500"}`}
                    >
                      {promoMessage}
                    </p>
                  )}
                </div>

                <div className="space-y-3 text-xs tracking-wide">
                  <div className="flex justify-between font-light text-[#666666]">
                    <span>Međuzbir:</span>
                    <span>{totalPrice} RSD</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-light text-green-600">
                      <span>Popust:</span>
                      <span>-{discount} RSD</span>
                    </div>
                  )}
                  <div className="flex justify-between font-light text-[#666666]">
                    <span>Dostava:</span>
                    <span className="uppercase text-[10px] text-[#E05A47] font-medium tracking-wider">
                      Besplatna
                    </span>
                  </div>
                  <div className="pt-4 mt-2 flex justify-between items-center border-t border-[#F0EFEA]">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#222222]">
                      Ukupno:
                    </span>
                    <span className="text-base font-semibold text-[#222222]">
                      {finalPrice} RSD
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#222222] text-white py-4 text-xs font-medium uppercase tracking-widest hover:bg-black transition-colors duration-300 mt-6"
                >
                  Završi Kupovinu
                </button>

                {!user && (
                  <p className="text-[10px] text-center text-[#888888] mt-3">
                    Kupujete kao gost.{" "}
                    <Link
                      to="/login"
                      className="underline hover:text-[#222222]"
                    >
                      Prijavi se
                    </Link>{" "}
                    za bolji iskustvo.
                  </p>
                )}

                <div className="mt-4 text-center">
                  <span className="text-[9px] uppercase tracking-widest text-[#BBBBBB] font-light block">
                    🔒 Sigurna enkriptovana naplata
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
