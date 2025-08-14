import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    isFreeSize: false,
    singlePrice: {
      originalPrice: "",
      discountedPrice: "",
    },
    sizes: [],
  });

  const [error, setError] = useState("");

  const categories = [
    "Kurti",
    "Heram",
    "Palazzo",
    "Pants",
    "Dupatta",
    "Leggings",
    "Three-Piece Kurti",
    "Two-Piece Kurti",
  ];

  const sizeOptions = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else if (name === "isFreeSize") {
      setForm({
        ...form,
        isFreeSize: checked,
        sizes: [],
        singlePrice: { originalPrice: "", discountedPrice: "" },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSinglePriceChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      singlePrice: { ...prev.singlePrice, [name]: value },
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...form.sizes];
    updatedSizes[index][field] = field === "inStock" ? value === "true" : value;
    setForm((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  const addSizeEntry = () => {
    setForm((prev) => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        { size: "", originalPrice: "", discountedPrice: "", inStock: true },
      ],
    }));
  };

  const removeSizeEntry = (index) => {
    const updated = [...form.sizes];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, sizes: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("image", form.image);

    if (form.isFreeSize) {
      formData.append("singlePrice", JSON.stringify(form.singlePrice));
    } else {
      formData.append("sizes", JSON.stringify(form.sizes));
    }

    try {
      const token = localStorage.getItem("adminToken");
      await api.post("/admin/products/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Product uploaded");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white shadow-lg rounded-lg px-8 py-10 border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-[#B19A99] mb-8">
        Upload a New Product ✨
      </h2>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        <input
          name="title"
          type="text"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 font-medium">
          <input
            type="checkbox"
            name="isFreeSize"
            checked={form.isFreeSize}
            onChange={handleChange}
            className="accent-[#B19A99]"
          />
          This is a free-size product
        </label>

        {form.isFreeSize && (
          <div className="space-y-2">
            <input
              type="number"
              name="originalPrice"
              placeholder="Original Price (₹)"
              value={form.singlePrice.originalPrice}
              onChange={handleSinglePriceChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
            <input
              type="number"
              name="discountedPrice"
              placeholder="Discounted Price (₹)"
              value={form.singlePrice.discountedPrice}
              onChange={handleSinglePriceChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
        )}

        {!form.isFreeSize && (
          <div>
            <label className="font-semibold text-[#B19A99]">Add Sizes:</label>
            {form.sizes.map((entry, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center gap-3 my-2 border p-2 rounded"
              >
                <select
                  value={entry.size}
                  onChange={(e) =>
                    handleSizeChange(index, "size", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                  required
                >
                  <option value="">--Size--</option>
                  {sizeOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Original ₹"
                  value={entry.originalPrice}
                  onChange={(e) =>
                    handleSizeChange(index, "originalPrice", e.target.value)
                  }
                  className="border px-2 py-1 rounded w-24"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount ₹"
                  value={entry.discountedPrice}
                  onChange={(e) =>
                    handleSizeChange(index, "discountedPrice", e.target.value)
                  }
                  className="border px-2 py-1 rounded w-24"
                  required
                />
                <select
                  value={entry.inStock}
                  onChange={(e) =>
                    handleSizeChange(index, "inStock", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeSizeEntry(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSizeEntry}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              + Add another size
            </button>
          </div>
        )}

        <div>
          <label className="block mb-2 font-semibold text-[#B19A99]">
            Upload Product Image:
          </label>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#B19A99] hover:bg-[#a27c7a] text-white py-2 rounded font-semibold transition"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
