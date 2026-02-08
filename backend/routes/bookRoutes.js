const express = require('express');
const Book = require('../models/Book');
const auth = require('../middlewares/auth');

const router = express.Router();

// GET ALL BOOKS

router.get("/all", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      success: true,
      total: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error: error.message
    });
  }
});


// SEARCH + PAGINATION
// search by author name
// /books/search?n=abc&page=1&limit=5

router.get("/search", async (req, res) => {
  try {
    const { n, page = 1, limit = 5 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let filter = {};
    if (n) {
      filter.$or = [
        { title: { $regex: n, $options: "i" } },
        { author: { $regex: n, $options: "i" } }
      ];
    }

    const skip = (pageNum - 1) * limitNum;

    const data = await Book.find(filter)
      .skip(skip)
      .limit(limitNum);

    const totalRecords = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      totalRecords,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalRecords / limitNum),
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message
    });
  }
});


// GET BOOK BY TITLE

router.get("/by-title", async (req, res) => {
  try {

    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const book = await Book.findOne({
      title: { $regex: title, $options: "i" }
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching book",
      error: error.message
    });
  }
});


// ADD BOOK

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }
    const { title, author, price } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: "Title and Author are required"
      });
    }

    const newBook = await Book.create({ title, author, price: Number(price) });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: newBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding book",
      error: error.message
    });
  }
});


// DELETE BOOK BY TITLE

router.delete("/by-title", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }
    const { title } = req.query;



    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }


    // Find the book first
    const book = await Book.findOne({
      title: { $regex: title, $options: "i" }
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    // Check if book is issued
    if (book.issued) {
      return res.status(409).json({
        success: false,
        message: "Book cannot be deleted because it is currently issued to a student"
      });
    }

    // If not issued, proceed to delete
    await Book.findByIdAndDelete(book._id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      deleted: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting book",
      error: error.message
    });
  }
});




module.exports = router;
