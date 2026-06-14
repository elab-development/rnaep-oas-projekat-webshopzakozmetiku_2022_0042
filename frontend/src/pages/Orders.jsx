import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          API.get("/api/orders"),
          API.get("/api/products"),
        ]);

        const ordersWithItems = await Promise.all(
          ordersRes.data.map(async (order) => {
            try {
              const itemsRes = await API.get(`/api/orders/${order.id}`);
              const itemsWithNames = itemsRes.data.items.map((item) => {
                console.log("product_id:", item.product_id);
                console.log(
                  "products:",
                  productsRes.data.map((p) => p._id),
                );
                const product = productsRes.data.find(
                  (p) => p._id === item.product_id,
                );
                return { ...item, name: product?.name || "Nepoznat proizvod" };
              });
              return { ...order, items: itemsWithNames };
            } catch {
              return { ...order, items: [] };
            }
          }),
        );
        setOrders(ordersWithItems);
      } catch (err) {
        console.error(err);
      }
    };
    loadOrders();
  }, []);

  return (
    <div className="bg-white min-h-screen text-[#222222] font-sans antialiased pb-24">
      <div className="text-center pt-12 pb-16">
        <h1 className="text-3xl md:text-4xl font-normal tracking-wide text-[#222222] mb-3 font-serif">
          Order History
        </h1>
        <div className="flex items-center justify-center space-x-2 text-[11px] uppercase tracking-widest text-[#888888]">
          <Link to="/" className="hover:text-[#222222]">
            Account
          </Link>
          <span>/</span>
          <span className="text-[#222222] font-medium">Orders</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {orders.length === 0 ? (
          <div className="bg-[#F9F9F9] p-16 text-center rounded-xs border border-[#F0EFEA]">
            <p className="text-xs uppercase tracking-widest text-[#888888] font-light">
              Još uvek nemate kreiranih porudžbina.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block bg-[#222222] text-white text-[10px] uppercase tracking-widest px-8 py-3.5 font-medium hover:bg-black transition-colors"
            >
              Istraži proizvode
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const isShipped =
                order.status?.toLowerCase() === "isporučeno" || !order.status;

              return (
                <div
                  key={order.id}
                  className="bg-[#F9F9F9] border border-[#F0EFEA] p-6 md:p-8 relative rounded-xs"
                >
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#EAE9E4]">
                    <div>
                      <span className="text-[10px] tracking-widest uppercase font-bold text-[#888888]">
                        ORDER NUMBER
                      </span>
                      <h3 className="text-xs font-mono font-medium text-[#222222] mt-0.5">
                        #{order.id}
                      </h3>
                    </div>

                    <span
                      className={`text-[9px] font-medium uppercase tracking-widest px-3 py-1 text-white ${
                        isShipped ? "bg-[#222222]" : "bg-[#E05A47]"
                      }`}
                    >
                      {order.status || "Isporučeno"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-[#888888] block mb-2">
                      Items Ordered
                    </span>

                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-baseline text-xs text-[#555555] pb-2 border-b border-[#EAE9E4]/40 last:border-none last:pb-0"
                      >
                        <div className="flex space-x-2">
                          <span className="font-light leading-relaxed max-w-md">
                            {item.name}
                          </span>
                          <span className="text-[#888888] font-normal">
                            (x{item.quantity})
                          </span>
                        </div>
                        <span className="font-medium text-[#222222] shrink-0 font-mono">
                          {item.price} RSD
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#EAE9E4] flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#222222]">
                      Total Amount
                    </span>
                    <span className="text-sm font-semibold text-[#222222] font-mono">
                      {order.total_price} RSD
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
