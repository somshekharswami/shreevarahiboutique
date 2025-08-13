const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const category = req.body.category || "uncategorized";

    return {
      folder: `varahi-boutique/${category}`, // ✅ exact existing path
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: file.originalname.split(".")[0], // optional but keeps image name readable
    };
  },
});

const upload = multer({ storage });
module.exports = upload;
