const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect("mongodb+srv://xuanquynh3824:03082004@cluster0.zssggef.mongodb.net/Zestora")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Express App is running");
});

// ✅ SỬA: Dùng __dirname + path.join
const uploadDir = path.join(__dirname, 'upload', 'images');
console.log("uploadDir =", uploadDir);

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created folder:', uploadDir);
} else {
  console.log('Folder already exists:', uploadDir);
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Phục vụ file tĩnh
app.use('/images', express.static(uploadDir));

// API upload
app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: "No file uploaded" });
  }

  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image:{
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date:{
    type:Date,
    default:Date.now,
  },
  available:{
    type:Boolean,
    required:true,
  },
})

app.post("/addproducts", async (req, res) => {
  let products = await Product.find({});
  let id;
  if(products.length>0){
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  }
  else{
    id=1;
  }
  const product = new Product({
    id:id,
    name:req.body.name,
    image:req.body.image,
    category:req.body.category,
    new_price:req.body.new_price,
    old_price:req.body.old_price,
    available:req.body.available,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success: true,
    name:req.body.name,
  })
})

//Creating API for deleting products

app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name:req.body.name
  })
})

// Creating API for getting all products

app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
})




app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});