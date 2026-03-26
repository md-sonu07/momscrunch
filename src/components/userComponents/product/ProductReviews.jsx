import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, User, ThumbsUp, Loader2, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviewsByProduct, postReview, removeReview } from '../../../redux/thunk/reviewThunk';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../../common/ConfirmationModal';

const ProductReviews = ({ productName, productId }) => {
    const dispatch = useDispatch();
    const { reviews, loading, submitting, deleting } = useSelector((state) => state.review);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [message, setMessage] = useState('');
    
    // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    useEffect(() => {
        if (productId) {
            dispatch(getReviewsByProduct(productId));
        }
    }, [dispatch, productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error("Please login to post a review");
            return;
        }

        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        try {
            await dispatch(postReview({
                product: productId,
                rating,
                comments: message
            })).unwrap();

            toast.success("Thank you for your review!");
            setRating(0);
            setMessage('');
        } catch (error) {
            toast.error(error || "Failed to post review");
        }
    };

    const handleDeleteClick = (reviewId) => {
        setReviewToDelete(reviewId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!reviewToDelete) return;
        
        try {
            await dispatch(removeReview(reviewToDelete)).unwrap();
            toast.success('Review deleted successfully');
            setIsDeleteModalOpen(false);
            setReviewToDelete(null);
        } catch (err) {
            toast.error(err || 'Failed to delete review');
        }
    };

    const averageRating = Array.isArray(reviews) && reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 border-t border-slate-100 dark:border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Review Form Section */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                            Share Your Experience
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-bold">
                            Love {productName}? Let other crunch lovers know!
                        </p>

                        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <div className="mb-6 text-center">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">
                                    Swipe for your rating
                                </label>
                                <div className="flex items-center justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="cursor-pointer transition-all duration-200 hover:scale-125"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-colors ${star <= (hover || rating)
                                                    ? "fill-amber-400 text-amber-400 shadow-amber-400/50"
                                                    : "text-slate-200 dark:text-slate-800"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {rating > 0 && (
                                    <p className="mt-2 text-xs font-black text-primary uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                                        {rating === 5 ? "Life-Changing!" : rating === 4 ? "Very Good" : rating === 3 ? "Nice" : rating === 2 ? "Could be better" : "Disappointing"}
                                    </p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 px-1">
                                    Written Review
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us what you liked most about this crunch..."
                                    className="w-full bg-white dark:bg-slate-800 border-none rounded-xl p-4 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary h-32 resize-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="cursor-pointer w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-black uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-3 transition-all hover:translate-y-[-2px] active:scale-[0.98] shadow-2xl shadow-slate-900/20"
                            >
                                <Send size={16} />
                                Post My Review
                            </button>
                        </form>
                    </div>
                </div>

                {/* Reviews List Section */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Customer Voice
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-bold">
                                Real feedback from our community
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{averageRating}</span>
                            <div className="flex gap-1 text-amber-400 mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={12}
                                        className={i < Math.floor(averageRating) ? "fill-current" : "text-slate-200 dark:text-slate-800"}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                                <Loader2 size={40} className="animate-spin" />
                                <p className="text-xs font-black uppercase tracking-widest">Loading reviews...</p>
                            </div>
                        ) : (Array.isArray(reviews) && reviews.length > 0) ? (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg border border-primary/5">
                                                {review.user?.full_name?.charAt(0) || review.user?.email?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">
                                                    {review.user?.full_name || review.user?.email || 'Anonymous User'}
                                                </h4>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-800"}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 font-medium">
                                        {review.comments}
                                    </p>

                                    {review.admin_reply && (
                                        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Store Reply</span>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium italic">
                                                "{review.admin_reply}"
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                                        {/* <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-widest">
                                            <ThumbsUp size={14} />
                                            Helpful ({review.likes || 0})
                                        </button> */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified Purchase</span>
                                            </div>
                                            {isAuthenticated && user?.id === review.user?.id && (
                                                <button
                                                    onClick={() => handleDeleteClick(review.id)}
                                                    disabled={deleting === review.id}
                                                    className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest cursor-pointer disabled:opacity-50"
                                                    title="Delete your review"
                                                >
                                                    {deleting === review.id ? (
                                                        <Loader2 size={13} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={13} />
                                                    )}
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-300 dark:text-slate-700 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-100 dark:border-white/5">
                                <MessageSquare size={48} />
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Be the first to review!</p>
                            </div>
                        )}
                    </div>

                    {Array.isArray(reviews) && reviews.length > 5 && (
                        <button className="cursor-pointer w-full mt-8 py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-400 hover:text-primary hover:border-primary transition-all uppercase tracking-widest">
                            View All {reviews.length} Reviews
                        </button>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Review?"
                message="Are you sure you want to delete this review? This action cannot be undone and your feedback will be removed permanently."
                confirmText="Delete Review"
                isLoading={deleting === reviewToDelete}
                variant="danger"
            />
        </div>
    );
};

export default ProductReviews;
