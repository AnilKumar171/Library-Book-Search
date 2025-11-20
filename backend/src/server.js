import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Book from "./models/book.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// GET /books API backed by MongoDB
app.get("/books", async (req, res) => {
    const { q, author, year, category } = req.query;

    const filters = {};

    if (author) {
        filters.author = { $regex: author, $options: "i" };
    }

    if (category) {
        filters.category = { $regex: category, $options: "i" };
    }

    if (year) {
        const parsedYear = Number(year);
        if (!Number.isNaN(parsedYear)) {
            filters.year = parsedYear;
        }
    }

    const orConditions = [];
    if (q) {
        orConditions.push(
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } }
        );
    }

    try {
        const query = orConditions.length
            ? { ...filters, $or: orConditions }
            : filters;

        const books = await Book.find(query).sort({ year: -1 }).lean();

        res.json(books);
    } catch (error) {
        console.error("Failed to fetch books:", error);
        res.status(500).json({ message: "Unable to fetch books right now." });
    }
});

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
    await connectDatabase();

    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
};

bootstrap();
