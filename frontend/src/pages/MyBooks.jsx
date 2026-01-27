import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmationContext";
import { getMyBooks, returnBook } from "../api/userApi";
import GlassCard from "../components/UI/GlassCard";
import AnimatedButton from "../components/UI/AnimatedButton";
import { motion } from "framer-motion";
import { BookMarked, Calendar, RotateCcw } from "lucide-react";

export default function MyBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBooks = async () => {
            try {
                const res = await getMyBooks();
                setBooks(res.data.data);
            } catch (err) {
                console.error("Failed to fetch my books", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyBooks();
    }, []);

    const { showToast } = useToast();
    const confirm = useConfirm();

    const handleReturn = async (bookId) => {
        const isConfirmed = await confirm(
            "Are you sure you want to return this book? This action cannot be undone.",
            "Return Book",
            { confirmText: "Yes, Return", type: "info" }
        );

        if (!isConfirmed) return;

        try {
            await returnBook(bookId);
            setBooks(prev => prev.filter(entry => entry.bookId?._id !== bookId));
            showToast("Book returned successfully!", "success");
        } catch (err) {
            showToast("Failed to return book. Please try again.", "error");
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                    My Collection
                </h2>
                <p className="text-gray-500 mt-2">Books currently issued to you</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-gray-200/50 rounded-2xl animate-pulse backdrop-blur-sm" />
                    ))}
                </div>
            ) : books.length === 0 ? (
                <div className="text-center py-20">
                    <GlassCard className="inline-block p-10">
                        <BookMarked size={48} className="mx-auto mb-4 text-emerald-500" />
                        <p className="text-xl font-semibold text-gray-700">No books issued yet</p>
                        <p className="text-gray-500 mt-2">Go to the Books page to issue some!</p>
                    </GlassCard>
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {books.map((entry) => {
                        // Safe access handling both populated and mock/flat logic
                        const book = entry.bookId || {};
                        const bookId = book._id;

                        return (
                            <motion.div variants={item} key={entry._id}>
                                <GlassCard className="h-full flex flex-col border-t-4 border-t-emerald-500/50">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-emerald-100/50 p-3 rounded-xl text-emerald-600 shrink-0">
                                            <BookMarked size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 line-clamp-1" title={books.title || "Unknown Title"}>
                                                {book.title || "Unknown Title"}
                                            </h3>
                                            <p className="text-gray-500 text-sm">{book.author || "Unknown Author"}</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Price</span>
                                                <span className="font-semibold text-gray-700">₹{book.price || 0}</span>
                                            </div>
                                            <div>
                                                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Issued Date</span>
                                                <div className="flex items-center gap-1 font-semibold text-emerald-600">
                                                    <Calendar size={14} />
                                                    <span>
                                                        {entry.issuedAt ? new Date(entry.issuedAt).toLocaleDateString('en-GB') : "Active"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <AnimatedButton
                                            variant="secondary"
                                            className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 border-red-200"
                                            onClick={() => handleReturn(bookId)}
                                        >
                                            <RotateCcw size={16} /> Return Book
                                        </AnimatedButton>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}