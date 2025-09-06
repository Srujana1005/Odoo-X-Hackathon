import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "supersecretkey"; // ⚠️ Move this to .env in production

app.use(cors());
app.use(bodyParser.json());

// ================== MongoDB Connection ==================
mongoose.connect('mongodb://127.0.0.1:27017/ecofinds', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ================== Schemas ==================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  language: { type: String, default: 'en' }
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  img: String,
  category: String
});

const notificationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Notification = mongoose.model('Notification', notificationSchema);

// ================== Middleware ==================
const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ================== Routes ==================

// Signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password, language } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashed, language });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ message: 'Email already exists' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid password" });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

// Logout
app.post('/api/logout', (req, res) => res.json({ message: "Logged out" }));

// Delete account
app.delete('/api/user', authMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.userId);
  await Notification.deleteMany({ userId: req.userId });
  res.json({ message: "Account deleted" });
});

// Update language
app.put('/api/language', authMiddleware, async (req, res) => {
  const { language } = req.body;
  const user = await User.findByIdAndUpdate(req.userId, { language }, { new: true });
  res.json({ user });
});

// Products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', authMiddleware, async (req, res) => {
  const { name, price, img, category } = req.body;
  const product = await Product.create({ name, price, img, category });
  res.json(product);
});

// Notifications
app.get('/api/notifications', authMiddleware, async (req, res) => {
  const notes = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(notes);
});

app.post('/api/notifications', authMiddleware, async (req, res) => {
  const { message } = req.body;
  const note = await Notification.crea
  te({ userId: req.userId, message });
  res.json(note);
});

// ================== Start Server ==================
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
