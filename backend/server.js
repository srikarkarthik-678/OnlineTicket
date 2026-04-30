require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ------------------ MODELS ------------------ */

// Event Model
const Event = mongoose.model("Event", {
  title: String,
  description: String,
  date: String,
  location: String,
  capacity: Number,
  price: Number,
});

// Ticket Model
const Ticket = mongoose.model("Ticket", {
  ticketId: String,
  eventId: String,
  userEmail: String,
  qrCode: String,
  checkedIn: { type: Boolean, default: false },
});

// User Model
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  role: String,
});

/* ------------------ AUTH ------------------ */

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send("User already exists");

    const isAdmin = email.endsWith("@mahindrauniversity.edu.in");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: isAdmin ? "admin" : "user",
    });

    await user.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Wrong password");

    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------ RAZORPAY ------------------ */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
app.post("/create-order", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount * 100,
      currency: "INR",
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------ EMAIL ------------------ */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ------------------ EVENTS ------------------ */

// Create Event
app.post("/api/events", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/tickets/book", async (req, res) => {
  try {
    const ticketId = Date.now().toString();
    const qr = await QRCode.toDataURL(ticketId);
    const ticket = new Ticket({
      ticketId,
      eventId: req.body.eventId,
      userEmail: req.body.email,
      qrCode: qr,
    });
    await ticket.save();
    console.log("Sending email to:", req.body.email);
    const ticketUrl = `http://localhost:8080/ticket.jsp?email=${req.body.email}&qr=${encodeURIComponent(
      qr
    )}`;
    await transporter.sendMail({
      to: req.body.email,
      subject: "Your Event Ticket 🎟",
      html: `
        <h2>Your Ticket</h2>
        <p>Click below to view your ticket:</p>
        <a href="${ticketUrl}" target="_blank">View Ticket</a>
      `,
    });

    res.json({ message: "Ticket booked", qr });
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Validate Ticket (FIXED)
app.post("/api/tickets/validate", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.body.ticketId });

    if (!ticket) return res.send("Invalid Ticket");

    if (ticket.checkedIn) return res.send("Already Used");

    ticket.checkedIn = true;
    await ticket.save();

    res.send("Entry Allowed");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------ SERVER ------------------ */
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);