'use client';

import { useState, useEffect, useRef } from 'react';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface SquarePaymentFormProps {
  planName?: string;
  amount?: string;
  onSuccess: (subscription: any) => void;
  onCancel?: () => void;
}

export default function SquarePaymentForm({
  planName = "Nova Executive Pro",
  amount = "$49/mo",
  onSuccess,
  onCancel,
}: SquarePaymentFormProps) {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [useSimulation, setUseSimulation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulation form states (for local testing before live Square keys are plugged in)
  const [simCardNumber, setSimCardNumber] = useState('•••• •••• •••• 4242');
  const [simExp, setSimExp] = useState('12/28');
  const [simCvv, setSimCvv] = useState('123');
  const [simPostal, setSimPostal] = useState('90210');

  const cardInstanceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || '';
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';
  const isPlaceholder = !appId || appId.includes('placeholder') || !locationId || locationId.includes('PLACEHOLDER');
  const env = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || 'sandbox';

  // 1. Load Square Web Payments SDK
  useEffect(() => {
    if (isPlaceholder) {
      setUseSimulation(true);
      setIsInitializing(false);
      return;
    }

    const scriptSrc = env === 'production'
      ? 'https://web.squarecdn.com/v1/square.js'
      : 'https://sandbox.web.squarecdn.com/v1/square.js';

    // Check if script is already present
    if (window.Square) {
      setIsSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => setIsSdkLoaded(true);
    script.onerror = () => {
      console.warn("Square SDK failed to load. Falling back to sandbox simulator.");
      setUseSimulation(true);
      setIsInitializing(false);
    };
    document.body.appendChild(script);

    return () => {
      // Don't remove script to allow reuse
    };
  }, [appId, locationId, env, isPlaceholder]);

  // 2. Initialize Card container when SDK is ready
  useEffect(() => {
    if (!isSdkLoaded || useSimulation) return;

    const square = window.Square;
    if (!square) return;
    const squareSdk: NonNullable<typeof window.Square> = square;

    let mounted = true;

    async function initSquare() {
      try {
        setIsInitializing(true);
        const payments = squareSdk.payments(appId, locationId);
        const card = await payments.card({
          style: {
            input: {
              color: '#1f2937',
              fontSize: '14px',
            },
            'input::placeholder': {
              color: '#9ca3af',
            },
          },
        });

        if (mounted && containerRef.current) {
          await card.attach('#card-container');
          cardInstanceRef.current = card;
          setIsInitializing(false);
        }
      } catch (err: any) {
        console.warn("Square Card attach failed, enabling simulation mode:", err);
        if (mounted) {
          setUseSimulation(true);
          setIsInitializing(false);
        }
      }
    }

    initSquare();

    return () => {
      mounted = false;
      if (cardInstanceRef.current) {
        cardInstanceRef.current.destroy().catch(() => {});
        cardInstanceRef.current = null;
      }
    };
  }, [isSdkLoaded, useSimulation, appId, locationId]);

  // 3. Handle Tokenization & Subscription Checkout
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      let token = '';

      if (useSimulation) {
        // Generate realistic Square sandbox token
        await new Promise(r => setTimeout(r, 900)); // Smooth simulation delay
        token = `cnon:test-card-nonce-${Date.now()}`;
      } else if (cardInstanceRef.current) {
        const tokenResult = await cardInstanceRef.current.tokenize();
        if (tokenResult.status !== 'OK') {
          const firstError = tokenResult.errors?.[0]?.message || 'Card validation failed';
          throw new Error(firstError);
        }
        token = tokenResult.token;
      } else {
        throw new Error("Payment form not initialized");
      }

      // Submit token to Next.js API route
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          plan: 'pro',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Checkout failed (${res.status})`);
      }

      const data = await res.json();
      console.log("Subscription activated successfully:", data);
      onSuccess(data.subscription);

    } catch (err: any) {
      console.error("Payment error:", err);
      setErrorMessage(err.message || 'Payment processing failed. Please verify card details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const fillTestCard = () => {
    setSimCardNumber('4111 •••• •••• 1111');
    setSimExp('12/28');
    setSimCvv('888');
    setSimPostal('10001');
  };

  return (
    <div className="bg-white rounded-2xl border border-[--border] p-6 shadow-sm">
      {/* Plan Summary Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[--border] mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 text-lg">{planName}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Monthly
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Full AI Executive Assistant Access</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-gray-900">{amount}</span>
          <p className="text-[11px] text-gray-400">Billed monthly</p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {useSimulation && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <div className="flex items-center justify-between font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Square Sandbox Simulation
            </span>
            <button
              type="button"
              onClick={fillTestCard}
              className="text-[11px] underline hover:text-amber-950 font-medium"
            >
              Fill Test Card
            </button>
          </div>
          <p className="text-[11px] text-amber-700 leading-relaxed">
            Live keys not set. Enter any demo details to test the tokenization &amp; checkout flow.
          </p>
        </div>
      )}

      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        {useSimulation ? (
          /* Simulated Card UI */
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={simCardNumber}
                  onChange={(e) => setSimCardNumber(e.target.value)}
                  placeholder="4111 2222 3333 4444"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
                <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Exp Date</label>
                <input
                  type="text"
                  required
                  value={simExp}
                  onChange={(e) => setSimExp(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  required
                  value={simCvv}
                  onChange={(e) => setSimCvv(e.target.value)}
                  placeholder="CVC"
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={simPostal}
                  onChange={(e) => setSimPostal(e.target.value)}
                  placeholder="ZIP"
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-center"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Real Square Web Payments Container */
          <div className="min-h-[110px]">
            {isInitializing && (
              <div className="h-28 flex items-center justify-center text-xs text-gray-400">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full mr-2" />
                Loading Square secure payment field...
              </div>
            )}
            <div id="card-container" ref={containerRef} />
          </div>
        )}

        {/* Security badges */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" /> 256-bit SSL Encrypted
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-400" /> Powered by Square
          </span>
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isProcessing || isInitializing}
            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-white shadow-sm flex items-center justify-center gap-2 transition ${
              isProcessing || isInitializing
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99]'
            }`}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Securing Subscription...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribe &amp; Activate Dashboard</span>
              </>
            )}
          </button>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 pt-1"
          >
            Cancel and review options
          </button>
        )}
      </form>
    </div>
  );
}
