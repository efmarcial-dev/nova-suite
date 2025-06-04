'use client';
import { useState, useEffect } from 'react';

export default function NewsLetterModal() {

    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        
        const hasSeenModal = localStorage.getItem('hasSeenNewsletterModal');
        if (!hasSeenModal) {
            setShowModal(true);
            localStorage.setItem('hasSeenNewsletterModal', 'true');
        }
        
        //setShowModal(true); // For testing purposes, always show the modal
        // Disable scroll when modal opens
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            // Restore scroll when modal closes
            document.body.style.overflow = '';
        }
        // Clean up when component unmounts
        return () => {
            document.body.style.overflow = '';
        }
        
    }, []);

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {

            e.preventDefault();
            const res = await fetch('https://www.novadev.solutions/api/create_newsletter/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email
                })
            });
            console.log('Email submitted:', email);
            if (res.ok) {
                setSubmitted(true);
            }
            else {
                const errorData = await res.json();
                console.error('Error submitting email:', errorData);
                setSubmitted(false);
            }

        }catch (error) {
            // TODO: Add message to post on the front end.
            console.error(error);
            setSubmitted(false);
        }finally {
            setLoading(false);
            setEmail('');
        }


    }

    if (!showModal) {
        return null; // Don't render anything if the modal shouldn't be shown
    }

    return (
    <>
        {showModal && (
            <div 
            className="fixed inset-0 bg-black/60 z-50 flex justify-center md:items-center items-end md:items-center md:pb-0"
            onClick={() => setShowModal(false)}
            >
                <div
                    onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
                    className = "pb-20 pb-safe-area-inset-bottom bg-white rounded-t-2xl md:rounded-2xl md:rounded-2xl w-full md:max-w-md p-6 shadow-lg slideUp animate-slide-up md:animate-fade-in"
                >

                    {!submitted ? (
                        <>
                            <h2 className="text-xl font-semibold mb-2">Join our newsletter</h2>
                            <p className="text-gray-600 mb-4">Get early access and exclusive lifetime pricing when NovaSuite launches.
                                We&apos;ll keep you updated as we build.
                            </p>
                            {/* Benifits List */}
                            <ul className="mb-4 list-disc list-inside text-sm text-gray-600">
                                <li>Be the first to test</li>
                                <li>Lock in early-bird lifetime access</li>
                                <li>Get regal updates as we build</li>
                            </ul>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="email" className="text-left block text-sm font-medium text-gray-700 mb-1">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder='you@example.com'
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                                    />

                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded transition ${
                                        loading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'
                                    }`}
                                >
                                    {loading && (
                                        <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                        </svg>
                                    )}
                                    {loading ? 'Submitting...' : 'Join Now'}
                                </button>
                            </form>
                        </>
                    ): (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">You&apos;re in!</h2>
                            <p className="text-gray-600 mb-4">
                                Thanks for signing up! You&apos;ll get updates and early access offers before launch.
                            </p>
                            <p className="text-gray-600 mb-4">
                                We&apos;ll keep you posted on our progress and let you know when we&apos;re ready to launch.
                            </p>
                            <button
                                onClick={() => setShowModal(false)}
                                className='w-full bg-gray-200 py-2 rounded text-gray-800 hover:bg-gray-300 transition'
                                aria-label="Close Newsletter Modal"
                            >
                                Close
                            </button>
                        </div>
                    )}

                </div>
            </div>
        )}


    </>
    )

}