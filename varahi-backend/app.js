  const express = require("express");
  const connectDB = require("./config/db");
  const cors = require("cors");
  const crypto = require("crypto");
  const Order = require("./models/Order");
  const sendEmail = require("./utils/sendEmail");
  const generateInvoice = require("./utils/generateInvoice");
  const path = require("path");
  require("dotenv").config();
  const app = express();


  // Middleware
  const allowedOrigins = [
  "http://localhost:5173",
  "https://shreevarahiboutique.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true
}))
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

//test-email Route
  // app.get("/test-email", async (req, res) => {
  //   try {
  //     console.log(">>> Received /test-email request");
  //     await sendEmail(
  //       process.env.GMAIL_USER, 
  //       "SMTP Test — Varahi Boutique",
  //       "<p>If you see this, SMTP is working!</p>"
  //     );
  //     return res.send("✅ Test email sent; check your inbox.");
  //   } catch (err) {
  //     console.error("💥 /test-email error:", err);
  //     return res.status(500).send("❌ Test email failed; see server logs.");
  //   }
  // });
  connectDB();

  // Routes
  //1st
  const productRoutes = require("./routes/productRoutes");
  app.use("/api/products", productRoutes);

  const adminRoutes = require("./routes/admin");
  app.use("/admin-login", adminRoutes);

  const adminProductRoutes = require("./routes/productAdmin");
  app.use("/admin/products", adminProductRoutes);

  const cartRoutes = require("./routes/cartRoutes");
  app.use("/cart", cartRoutes);

  const userRoutes = require("./routes/user");
  app.use("/api/users", userRoutes);
  //Contact-Email Routes 
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);


  // Secure Checkout Route
  const checkoutRoutes = require("./routes/checkoutRoutes");
  app.use("/api/checkout", checkoutRoutes);

  const orderRoutes = require("./routes/orderRoutes");
  app.use("/api/orders", orderRoutes);  



  // Payment verification
  app.post("/payment/verify", async (req, res) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      firebaseUID,
      cartItems,
      shippingAddress,
    } = req.body;
    if (process.env.NODE_ENV === "test") {
    console.log("💳 Skipping Razorpay verification in test mode");
    razorpay_order_id = "test_order_id";
    razorpay_payment_id = "test_payment_id";
    razorpay_signature = "test_signature";
  }else{

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ status: "failure", message: "Invalid signature" });
    }
  }
    try {
      const orderTotalPaise = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity * 100,
        0
      );

      const order = await Order.create({
        firebaseUID,
        items: cartItems,
        shippingAddress,
        payment: {
          razorpay_order_id,
          razorpay_payment_id,
          status: "paid",
          amount: orderTotalPaise,
        },
      });
      // Generate order number
  const orderNumber = `VB${order._id.toString().slice(-6)}`;
  await Order.findByIdAndUpdate(order._id, { orderNumber });
  console.log("✅ Order saved:", order._id);



  // Generate Pdf Invoice: 
  const invoicePath = path.join(__dirname, "invoices", `invoice-${orderNumber}.pdf`);
  await generateInvoice(order, invoicePath);
  // ── ✉️ EMAIL LOGIC START ──

      // a) Prep details
      const customerEmail = shippingAddress.email;
      const customerName  = shippingAddress.name;
      const ADMIN_EMAIL   = "shreevarahiboutique@gmail.com";

      const formattedItems = order.items
        .map(item => `<li>${item.title} (x${item.quantity}) — ₹${item.price}</li>`)
        .join("");

      // b) Send to customer
      const userHtml = `
        <h2>Hello ${customerName},</h2>
        <p>Your order <strong>#${orderNumber}</strong> has been confirmed!</p>
        <ul>${formattedItems}</ul>
        <p><strong>Total Paid:</strong> ₹${(order.payment.amount/100).toFixed(2)}</p>
        <p>Thank you for shopping with Varahi Boutique.</p>
      `;
    await sendEmail(customerEmail, "🛍️ Your Order is Confirmed", userHtml, [
    {
      filename: `invoice-${orderNumber}.pdf`,
      path: invoicePath,
      contentType: "application/pdf",
    },
  ]);

      // c) Send to admin
      const adminHtml = `
        <h2>New Order Received</h2>
        <p><strong>Order #:</strong> ${orderNumber}</p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <ul>${formattedItems}</ul>
        <p><strong>Total:</strong> ₹${(order.payment.amount/100).toFixed(2)}</p>
      `;
    await sendEmail(ADMIN_EMAIL, "📦 New Order Placed", adminHtml, [
    {
      filename: `invoice-${orderNumber}.pdf`,
      path: invoicePath,
      contentType: "application/pdf",
    },
  ]);


      console.log("📨 Confirmation emails sent.");

  return res.json({ 
    status: "success", 
    orderId: order._id,
    orderNumber: orderNumber 
  });

      console.log("✅ Order saved:", order._id);
      return res.json({ status: "success", orderId: order._id });
    } catch (err) {
      console.error("❌ Failed to save order:", err);
      return res.status(500).json({ status: "error", message: "Order save failed" });
    }
  });

  // Add this endpoint after your payment verification
  app.get("/api/orders/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app.get("/", (req, res) => {
    res.send("✅ API is running...");
  });
  module.exports=app;