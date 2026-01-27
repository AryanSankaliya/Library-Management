import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { addBook } from '../api/bookApi';
import GlassCard from '../components/UI/GlassCard';
import Input from '../components/UI/Input';
import AnimatedButton from '../components/UI/AnimatedButton';
import { PlusCircle, IndianRupee, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddBook() {
    const [form, setForm] = useState({
        title: "",
        author: "",
        price: ""
    });
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await addBook(form);
            showToast("Book Added Successfully ✅", "success");
            setForm({ title: "", author: "", price: "" }); // Reset form
        } catch (error) {
            showToast("Failed to add book. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center h-[calc(100vh-150px)] overflow-hidden">
            <GlassCard className="w-full max-w-lg p-6" delay={0.1}>
                <div className="text-center mb-5">
                    <div className="mx-auto w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-3">
                        <PlusCircle size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Add New Book</h2>
                    <p className="text-gray-500 text-xs mt-1">Enter book details to add to the library</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                        <Input
                            label="Book Title"
                            name="title"
                            placeholder="e.g. The Great Gatsby"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="pl-10 text-sm !mb-1"
                        />
                        <BookOpen size={16} className="absolute left-3 top-[34px] text-gray-400" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Input
                                label="Author Name"
                                name="author"
                                placeholder="e.g. F. Scott Fitzgerald"
                                value={form.author}
                                onChange={handleChange}
                                required
                                className="pl-10 text-sm !mb-0"
                            />
                            <User size={16} className="absolute left-3 top-[34px] text-gray-400" />
                        </div>

                        <div className="relative">
                            <Input
                                label="Price"
                                name="price"
                                placeholder="e.g. 500"
                                value={form.price}
                                onChange={handleChange}
                                required
                                className="pl-10 text-sm !mb-0"
                                type="number"
                            />
                            <IndianRupee size={16} className="absolute left-3 top-[34px] text-gray-400" />
                        </div>
                    </div>

                    <AnimatedButton
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 py-2.5"
                    >
                        {loading ? "Adding..." : "Add Book"}
                    </AnimatedButton>
                </form>
            </GlassCard>
        </div>
    );
}