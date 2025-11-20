import fs from "fs";

// Load books only once
const books = JSON.parse(fs.readFileSync("books.json", "utf-8"));

export const getBooks = (req, res) => {
    let { q, author, year, category } = req.query;

    let result = books;

    const match = (value, keyword) =>
        value.toLowerCase().includes(keyword.toLowerCase());

    // Search by title or description
    if (q) {
        result = result.filter(
            (book) => match(book.title, q) || match(book.description, q)
        );
    }

    // Filter by author
    if (author) {
        result = result.filter((book) => match(book.author, author));
    }

    // Filter by exact year
    if (year) {
        result = result.filter((book) => book.year == year);
    }

    // Filter by category
    if (category) {
        result = result.filter((book) => match(book.category, category));
    }

    res.json(result);
};
