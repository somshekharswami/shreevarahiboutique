import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/orders/admin-orderr"
        );
        if (!res.ok) throw new Error("Failed to fetch all orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="text-red-600 p-4">{error}</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        📦 All Orders (Admin)
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 mb-8"
        >
          <div className="flex flex-wrap justify-between text-sm text-gray-600 mb-2">
            <div>
              <strong>Order Number:</strong> {order.orderNumber}
            </div>
            <div>
              <strong>UID:</strong> {order.firebaseUID}
            </div>
            <div>
              <strong>Created:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Status:</strong> {order.payment?.status || "N/A"}
            </div>
            <div>
              <strong>Amount:</strong> ₹{(order.payment?.amount ?? 0) / 100}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-1">📦 Items:</h4>
            <ul className="ml-4 list-disc text-sm text-gray-700">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  <span className="font-medium">{item.title}</span> (
                  {item.size || "Free size"}) × {item.quantity} – ₹{item.price}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-1">
              🚚 Shipping Info:
            </h4>
            <p>Name: {order.shippingAddress.name}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
            <p>Email: {order.shippingAddress.email}</p>
            <p>
              Address: {order.shippingAddress.address},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </p>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-1">💳 Payment:</h4>
            <p>Razorpay Order ID: {order.payment.razorpay_order_id}</p>
            <p>Razorpay Payment ID: {order.payment.razorpay_payment_id}</p>
            <p>Status: {order.payment.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
