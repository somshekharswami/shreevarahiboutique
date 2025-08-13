import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GiDress } from "react-icons/gi";
const MyOrders = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.uid) {
        setError("Login to See your Orders");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/user/${currentUser.uid}`
        );
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching your orders.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [currentUser, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 text-pink-700">
        <GiDress className="w-16 h-20 animate-bounce" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-medium">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 text-lg">
        <p>You have no orders yet.</p>
        <a
          href="/"
          className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-pink-600 font-serif mb-10">
          🛍️ My Orders
        </h2>

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-pink-100 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 mb-8"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
              <span className="text-sm text-gray-400">Order ID</span>
              <span className="text-sm font-medium text-gray-800">
                {order.orderNumber}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
              <span className="text-sm text-gray-400">Date</span>
              <span className="text-sm text-gray-700">
                {new Date(order.createdAt).toLocaleDateString()}{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </span>
            </div>

            {/* Payment Status */}
            <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
              <span className="text-sm text-gray-400">Payment Status</span>
              <span
                className={`px-4 py-1 rounded-lg text-sm font-semibold capitalize ${
                  order.payment?.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.payment?.status || "Pending"}
              </span>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-200 pt-4">
              <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    <span className="font-semibold text-gray-800">
                      {item.title}
                    </span>{" "}
                    ({item.size}) × {item.quantity} – ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-6 border-t pt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1 text-green-600 font-medium">
                🚚 Delivery within 48 hours
              </span>
              <a
                href="tel:+918355907193"
                className="mt-3 sm:mt-0 text-pink-600 hover:underline font-medium flex items-center gap-1"
              >
                "Need changes? Cancel or edit order — 📞 +91 83559 07193."
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
