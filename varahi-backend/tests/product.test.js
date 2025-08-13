const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Product = require("../models/Product"); // adjust path if needed

describe("Product API", () => {
  let testProduct;

  // ✅ Seed a test product before tests
  beforeAll(async () => {
    testProduct = await Product.create({
      title: "Test Kurti",
      description: "Beautiful kurti for testing",
      category: "Women",
      singlePrice: 999,
      imageUrl: "http://test.com/img.jpg",
      isActive: true,
    });
  });

  // ✅ Clean up after tests
  afterAll(async () => {
    await Product.deleteMany({});
    await mongoose.connection.close();
  });

  // ✅ Already done
  it("should fetch all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  //  Test: Fetch by valid ID
  it("should fetch a product by valid ID", async () => {
    const res = await request(app).get(`/api/products/${testProduct._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Test Kurti");
  });

  //  Test: Fetch by invalid ID
  it("should return 404 for non-existent ID", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/products/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});
