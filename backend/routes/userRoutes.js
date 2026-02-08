const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/User");
const Book = require("../models/Book");
const auth = require("../middlewares/auth"); // auth middleware
const logActivity = require("../utils/activityLogger");

const router = express.Router();

/* =====================================================
   USER REGISTER
   POST /user/register
===================================================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 🔴 ONE ADMIN POLICY
    if (req.body.role === 'admin') {
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: "An Admin account already exists. Only one admin is allowed.",
        });
      }
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: req.body.role || 'user' // Default to user if not specified
    });

    // Log Activity
    await logActivity(email, 'REGISTER', `New user registered: ${name}`);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =====================================================
   USER LOGIN
   POST /user/login
===================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? email.trim() : "";

    // find user
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token,
      role: user.role,
      email: user.email,
    });

    // Log Activity
    await logActivity(user.email, 'LOGIN', 'User logged in');
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =====================================================
   ISSUE BOOK
   POST /user/issue/:bookId
   (Protected Route)
===================================================== */
router.post("/issue/:bookId", auth, async (req, res) => {
  try {
    // find book by id
    const rawId = req.params.bookId;
    const cleanId = rawId.trim();

    let book;
    if (mongoose.Types.ObjectId.isValid(cleanId)) {
      book = await Book.findById(cleanId);
    } else {
      return res.status(400).json({ success: false, message: "Invalid Book ID format" });
    }

    // 🔴 FIRST: check book exists
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found (ID: ${cleanId})`,
      });
    }

    // 🔴 SECOND: admin check
    if (req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins cannot issue books",
      });
    }

    // 🔴 THIRD: already issued check
    if (book.issued) {
      return res.status(400).json({
        success: false,
        message: "Book already issued",
      });
    }

    // 🔴 FOURTH: Max 3 books limit check
    const currentUser = await User.findById(req.user.id);
    if (currentUser.issuedBooks.length >= 3) {
      return res.status(400).json({
        success: false,
        message: "You have reached the limit of 3 issued books. Please return a book to issue a new one.",
      });
    }

    // Atomic check and update to prevent race conditions and duplicates
    // We try to add the book to the user's list ONLY if it's not already there.
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id, "issuedBooks.bookId": { $ne: book._id } },
      { $push: { issuedBooks: { bookId: book._id } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "You have already issued this book",
      });
    }

    // mark book as issued
    book.issued = true;
    book.issuedTo = req.user.id;
    await book.save();


    // Log Activity
    // Use currentUser.email since req.user.email might be missing in old tokens
    await logActivity(currentUser.email, 'ISSUE_BOOK', `Issued book: ${book.title}`);

    res.status(200).json({
      success: true,
      message: "Book issued successfully",

    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =====================================================
   RETURN BOOK
   POST /user/return/:bookId
   (Protected Route)
===================================================== */
router.post("/return/:bookId", auth, async (req, res) => {
  try {
    const rawId = req.params.bookId;
    const cleanId = rawId.trim();

    if (!mongoose.Types.ObjectId.isValid(cleanId)) {
      return res.status(400).json({ success: false, message: "Invalid Book ID format" });
    }

    // 1. Update the Book model (set issued to false, clear issuedTo)
    const book = await Book.findById(cleanId);
    if (book) {
      book.issued = false;
      book.issuedTo = null;
      await book.save();
    }

    // 2. Remove from User's issuedBooks list
    // Use $pull to remove the entry with the matching bookId
    // Get the updated user to access email for logging
    const user = await User.findByIdAndUpdate(req.user.id, {
      $pull: { issuedBooks: { bookId: cleanId } },
    }, { new: true });

    // Log Activity (fetch book title before is tricky if we don't have it, but we can look it up or just use ID. Better to have title)
    let details = `Returned book ID: ${cleanId}`;
    if (book) details = `Returned book: ${book.title}`;

    if (user) {
      await logActivity(user.email, 'RETURN_BOOK', details);
    }

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =====================================================
   MY ISSUED BOOKS
   GET /user/my-books
   (Protected Route)
===================================================== */
router.get("/my-books", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("issuedBooks.bookId");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Filter out entries where bookId is null (book was deleted)
    const validIssuedBooks = user.issuedBooks.filter(entry => entry.bookId !== null);

    // If we found invalid/deleted books, update the user record
    if (validIssuedBooks.length !== user.issuedBooks.length) {
      user.issuedBooks = validIssuedBooks;
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: validIssuedBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* =====================================================
   GET ALL USERS (Admin Only)
   GET /user/all
   (Protected Route)
===================================================== */
router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const users = await User.find().select("-password"); // Exclude password
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


/* =====================================================
   DELETE ACCOUNT
   POST /user/delete
   (Protected Route)
   ===================================================== */
router.post("/delete", auth, async (req, res) => {
  try {
    // 1. Verify User exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Return All Issued Books
    // Find books issued to this user
    const issuedBooks = user.issuedBooks; // This is an array of objects { bookId: ObjectId, ... }

    if (issuedBooks.length > 0) {
      const bookIds = issuedBooks.map(entry => entry.bookId);

      // Update all these books: set issued=false, issuedTo=null
      await Book.updateMany(
        { _id: { $in: bookIds } },
        { $set: { issued: false, issuedTo: null } }
      );
    }

    // 3. Delete User
    await User.findByIdAndDelete(req.user.id);

    // Log Activity
    await logActivity(user.email, 'DELETE_USER', 'User deleted their account');

    res.status(200).json({
      success: true,
      message: "Account deleted and books returned successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
