'use client';

import { useState, useEffect} from 'react';

export default function JoinWaitlistModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
  if (open) {
    // Disable scroll when modal opens
    document.body.style.overflow = 'hidden';
  } else {
    // Restore scroll when modal closes
    document.body.style.overflow = '';
  }

  // Clean up when component unmounts
  return () => {
    document.body.style.overflow = '';
  };
}, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
    // TODO: integrate with backend or service (e.g. Firebase, Supabase, etc.)
    const res = await fetch('https://www.novadev.solutions/api/create_wait_list/', {
      method: 'POST',
      headers : {
        'Content-Type' : 'application/json',
      },
      credentials: "include",
      body : JSON.stringify({
        name: firstName,
        email : email
      })
    })
    console.log('First Name:', firstName);
    console.log('Email submitted:', email);
    console.log(res)
    setSubmitted(true);
    } catch(error){
      // TODO: Add message to post on the front end.
      console.log(`Error: ${error}`);
      setSubmitted(false);
    }
  };

  return (
    <>
      <button data-event='early-access' className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition"
           onClick={() => {
            setOpen(true);
            
          }}
        >
          Join Waitlist
        </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex justify-center md:items-center items-end md:items-center md:pb-0"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="pb-20 pb-safe-area-inset-bottom bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md p-6 shadow-lg slideUp  animate-slide-up md:animate-fade-in"
            style={{ overflow: 'visible' }}
          >
            {!submitted ? (
              <>
                <h2 className="text-xl font-semibold mb-2">Join the Waitlist</h2>
                <p className="text-gray-600 mb-4">
                  Get early access and exclusive lifetime pricing when NovaSuite launches.
                  We&apos;ll keep you updated as we build.
                </p>
                {/* Benefits List */}
                <ul className="mb-4 list-disc list-inside text-sm text-gray-600">
                  <li>Be the first to test</li>
                  <li>Lock in early-bird lifetime access</li>
                  <li>Get regal updates as we build</li>
                </ul>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    Join Now
                  </button>
                </form>
              </>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-2">You&apos;re in!</h2>
                <p className="text-gray-600 mb-4">
                  Thanks for signing up, {firstName || 'there'}! You&apos;ll get updates and early access offers before launch.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full bg-gray-200 py-2 rounded text-gray-800 hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
