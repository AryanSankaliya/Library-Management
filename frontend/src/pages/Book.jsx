import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { getAllBooks, searchBooks } from "../api/bookApi";
import { issueBook as issueBookApi } from "../api/userApi";
import GlassCard from "../components/UI/GlassCard";
import AnimatedButton from "../components/UI/AnimatedButton";
import { motion } from "framer-motion";
import { Book as BookIcon, CheckCircle, Search } from "lucide-react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("user");
  const { showToast } = useToast();

  useEffect(() => {
    const r = localStorage.getItem("role");
    if (r) setRole(r);
  }, []);

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        let res;
        if (searchTerm.trim() === "") {
          res = await getAllBooks();
        } else {
          res = await searchBooks(searchTerm);
        }
        setBooks(res.data.data);
      } catch (err) {

      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const [issuingIds, setIssuingIds] = useState(new Set());

  const issueBook = async (id) => {
    if (issuingIds.has(id)) return;

    setIssuingIds(prev => new Set(prev).add(id));
    try {
      await issueBookApi(id);
      // Update local state to reflect issue
      setBooks(prev =>
        prev.map(book =>
          book._id === id ? { ...book, issued: true } : book
        )
      );
      showToast("Book issued successfully", "success");
    } catch (err) {
      showToast(err.response?.data?.message || err.message || "Issue failed", "error");
    } finally {
      setIssuingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600">
            Library Collection
          </h2>
          <p className="text-gray-500 mt-2">Browse and issue books from our collection</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" size={20} />
          <input
            type="text"
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/30 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-200/50 rounded-2xl animate-pulse backdrop-blur-sm" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <BookIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-xl">No books found matching your search.</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {books.map((book) => (
            <motion.div variants={item} key={book._id}>
              <GlassCard className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-blue-500/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-100/50 p-3 rounded-xl text-blue-600">
                    <BookIcon size={24} />
                  </div>
                  {book.issued && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle size={12} /> Issued
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-gray-500 mb-4">{book.author}</p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-2xl font-bold text-sla-700">₹{book.price}</span>

                  {role === 'admin' ? (
                    <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed font-medium text-sm">
                      Admin View
                    </button>
                  ) : (
                    <AnimatedButton
                      onClick={() => issueBook(book._id)}
                      disabled={book.issued || issuingIds.has(book._id)}
                      variant={book.issued ? "secondary" : "primary"}
                      className={book.issued || issuingIds.has(book._id) ? "opacity-60" : ""}
                    >
                      {book.issued ? "Issued" : issuingIds.has(book._id) ? "Issuing..." : "Issue Now"}
                    </AnimatedButton>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
