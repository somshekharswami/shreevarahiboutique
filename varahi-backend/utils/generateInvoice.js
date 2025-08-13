const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

async function generateInvoice(order, filepath) {
   if (process.env.NODE_ENV === "test") {
    console.log("📄 Skipping invoice generation in test mode");
    return null;
  }
  const templatePath = path.join(__dirname, "../templates/invoice-template.html");
  const templateHtml = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateHtml);

  const totalAmount = (order.payment.amount / 100).toFixed(2);
  const formattedItems = order.items.map(item => ({
    title: item.title,
    quantity: item.quantity,
    price: item.price.toFixed(2),
    subtotal: (item.quantity * item.price).toFixed(2),
  }));

  const html = template({
    orderNumber: order.orderNumber,
    orderDate: new Date().toLocaleDateString(),
    customerName: order.shippingAddress.name,
    customerEmail: order.shippingAddress.email,
    customerPhone: order.shippingAddress.phone || "—",
    items: formattedItems,
    subtotal: formattedItems.reduce((sum, i) => sum + parseFloat(i.subtotal), 0).toFixed(2),
    shipping:"Free", // You can replace this with dynamic if needed
    total: totalAmount,
  });

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  await page.pdf({
    path: filepath,
    format: "A4",
    printBackground: true,
    margin: { top: "40px", bottom: "40px" },
  });

  await browser.close();
}

module.exports = generateInvoice;
