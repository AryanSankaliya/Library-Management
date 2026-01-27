import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmationContext";
import { deleteByTitle } from "../api/bookApi";
import GlassCard from "../components/UI/GlassCard";
import AnimatedButton from "../components/UI/AnimatedButton";
import Input from "../components/UI/Input";
import { Trash2, AlertTriangle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteBook() {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [deletedBook, setDeletedBook] = useState(null);

    const { showToast } = useToast();
    const confirm = useConfirm();

    const handleDelete = async (e) => {
        e.preventDefault();

        const isConfirmed = await confirm(
            `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            "Delete Book",
            { confirmText: "Yes, Delete", type: "danger" }
        );

        if (!isConfirmed) return;

        setLoading(true);
        setDeletedBook(null);

        try {
            const res = await deleteByTitle(title);
            setDeletedBook({
                title: res.data.deleted.title,
                author: res.data.deleted.author
            });
            setTitle("");
            showToast("Book deleted successfully", "success");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to delete book. Check if title is correct.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto min-h-[70vh] flex flex-col justify-center">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
                    Delete Book
                </h2>
                <p className="text-gray-500 mt-2">Permanently remove a book from the library</p>
            </div>

            <GlassCard className="p-8 border-t-4 border-t-red-500">
                <form onSubmit={handleDelete} className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="text-red-500 shrink-0 mt-1" />
                        <p className="text-sm text-red-700">
                            Warning: Deleting a book is permanent. Ensure you have the correct title before proceeding.
                        </p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            placeholder="Enter exact book title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="pl-10"
                        />
                    </div>

                    <AnimatedButton
                        type="submit"
                        disabled={loading || !title}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-red-500/30"
                    >
                        {loading ? "Deleting..." : <><Trash2 size={20} /> Delete Book</>}
                    </AnimatedButton>
                </form>
            </GlassCard>

            <AnimatePresence>
                {deletedBook && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-8"
                    >
                        <GlassCard className="bg-green-50 border border-green-200">
                            <div className="flex items-center gap-4 text-green-800">
                                <div className="p-3 bg-green-200 text-green-700 rounded-full">
                                    <Trash2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Book Deleted Successfully</h4>
                                    <p className="text-sm opacity-80">
                                        Removed: <span className="font-semibold">"{deletedBook.title}"</span> by {deletedBook.author}
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
