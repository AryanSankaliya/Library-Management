const cron = require('node-cron');
const User = require('./models/User');
const Book = require('./models/Book');

const startCronJob = () => {
    // Run every day at midnight (00:00)
    // For testing purposes, you can change this to '* * * * *' (every minute)
    cron.schedule('0 0 * * *', async () => {


        try {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            // Find users who have at least one book issued before 7 days ago
            const users = await User.find({
                "issuedBooks.issuedAt": { $lt: sevenDaysAgo }
            });

            if (users.length === 0) {

                return;
            }

            let returnedCount = 0;

            for (const user of users) {
                // Filter out the books that need to be returned
                const booksToReturn = user.issuedBooks.filter(
                    book => new Date(book.issuedAt) < sevenDaysAgo
                );

                if (booksToReturn.length > 0) {
                    const bookIds = booksToReturn.map(b => b.bookId);

                    // 1. Update Books collection: set issued=false, issuedTo=null
                    await Book.updateMany(
                        { _id: { $in: bookIds } },
                        { $set: { issued: false, issuedTo: null } }
                    );

                    // 2. Remove these books from User's issuedBooks array
                    // We keep only the books that are NOT in the booksToReturn list
                    // Or simply filter against the specific IDs or date
                    user.issuedBooks = user.issuedBooks.filter(
                        book => new Date(book.issuedAt) >= sevenDaysAgo
                    );

                    await user.save();
                    returnedCount += booksToReturn.length;

                }
            }



        } catch (error) {
            console.error('Error in Auto-Return Cron Job:', error);
        }
    });
};

module.exports = startCronJob;
