'use client';

import React, { useState } from 'react';
import { CreditCard, PaymentForm } from 'react-square-web-payments-sdk';
import { ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Lock, RefreshCw } from 'lucide-react';
import { fetchWithAuthRefresh } from '@/app/lib/api/fetchWithAuthRefresh';

interface SquareCheckoutProps {
  planName?: string;
  originalPrice?: number;
  finalPrice?: number;
  promoCode?: string;
  amountCents?: number;
  plan?: string;
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

export default function SquareCheckout({
  planName = 'NovaSuite Founder Lifetime Access',
  originalPrice = 49,
  finalPrice = 49,
  promoCode,
  amountCents = 4900,
  plan = 'founder_lifetime',
  onSuccess,
  onCancel,
}: SquareCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const APPLICATION_ID = process.env.NEXT_PUBLIC_SQUARE_APP_ID || process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || '';
  const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';
  const squareEnvironment = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || 'sandbox';
  const applicationIsSandbox = APPLICATION_ID.startsWith('sandbox-');
  const environmentMatches = squareEnvironment === 'production' ? !applicationIsSandbox : applicationIsSandbox;

  const handlePaymentTokenReceived = async (tokenResult: any, buyer?: any) => {
    setIsProcessing(true);
    setMessage(null);

    // tokenResult.token is the one-time ctok-... nonce from Square
    const sourceId = tokenResult?.token;

    if (!sourceId) {
      setMessage({ type: 'error', text: 'Card tokenization failed. Please try again.' });
      setIsProcessing(false);
      return;
    }

    try {
      // Step 1: Charge via Django → Square backend (POST /api/payments/charge/)
      const chargeRes = await fetchWithAuthRefresh('/api/payments/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_id: sourceId,
          amount: amountCents,
          plan,
          promo_code: promoCode,
          buyer_verification_token: buyer?.token ?? null,
        }),
      });

      const chargeData = await chargeRes.json();

      if (!chargeRes.ok || chargeData.status !== 'SUCCESS') {
        throw new Error(
          chargeData.message || chargeData.error || 'Payment was declined. Please try a different card.'
        );
      }

      // Django has already recorded the invoice and activated the subscription
      // before returning SUCCESS. Do not POST to /api/subscription here: that
      // backend endpoint is a status-only GET and the old Next.js fallback
      // could show success even when no subscription had been persisted.
      setPaymentSuccess(true);
      setMessage({
        type: 'success',
        text: `Payment successful! Your ${planName} is now active. Receipt: ${chargeData.receipt_url ?? 'emailed to you'}.`,
      });

      if (onSuccess) {
        setTimeout(() => onSuccess(chargeData), 1200);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setMessage({ type: 'error', text: err.message || 'Could not connect to the payment backend.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center shadow-xs">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Confirmed!</h3>
        {message && (
          <p className="text-sm text-gray-600 max-w-sm mx-auto mb-4">{message.text}</p>
        )}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-white px-3.5 py-1.5 rounded-full border border-emerald-200">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Activating your executive workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-indigo-50/60 border border-amber-200/70 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">{planName}</div>
            <div className="flex items-center gap-2 mt-0.5">
              {originalPrice > finalPrice && (
                <span className="text-xs text-gray-400 line-through">${originalPrice}.00</span>
              )}
              <span className="text-base font-extrabold text-gray-900">${finalPrice}.00 USD</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                Lifetime · one time
              </span>
            </div>
            {promoCode && (
              <div className="text-[11px] text-amber-700 mt-1 font-medium">
                Promo <code className="font-mono font-semibold">{promoCode}</code> applied
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Square SDK Card Form */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Secure Header */}
        <div className="bg-gray-950 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Square mark */}
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center p-1">
              <div className="w-full h-full bg-gray-950 rounded-[2px] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-[1px]" />
              </div>
            </div>
            <span className="text-sm font-bold tracking-tight">Square</span>
            <span className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded font-medium uppercase">
              Secure Card Entry
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <Lock className="w-3 h-3" /> Encrypted
          </div>
        </div>

        {/* PaymentForm from react-square-web-payments-sdk */}
        <div className="p-5">
          {APPLICATION_ID && LOCATION_ID && environmentMatches ? (
            <PaymentForm
              applicationId={APPLICATION_ID}
              locationId={LOCATION_ID}
              cardTokenizeResponseReceived={handlePaymentTokenReceived}
            >
              {/* Square-hosted secure iframe card inputs */}
              <CreditCard
                buttonProps={{
                  isLoading: isProcessing,
                  css: {
                    backgroundColor: isProcessing ? '#9ca3af' : '#111827',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    width: '100%',
                    marginTop: '16px',
                    transition: 'background-color 0.2s',
                  },
                }}
              >
                {isProcessing ? 'Processing...' : `Pay $${finalPrice}.00 — Activate lifetime access`}
              </CreditCard>
            </PaymentForm>
          ) : (
            /* Env vars missing — show clear instructions */
            <div className="text-center py-8 px-4 bg-amber-50 rounded-xl border border-amber-200">
              <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 text-sm mb-1">
                {!environmentMatches ? 'Square Environment Mismatch' : 'Square Credentials Required'}
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                {!environmentMatches
                  ? `The ${squareEnvironment} setting does not match the Square application ID. Use matching ${squareEnvironment} credentials.`
                  : 'Configure matching Square application and location IDs for the selected environment.'}
              </p>
              <div className="text-left bg-gray-900 text-emerald-300 font-mono text-[11px] rounded-lg p-3 space-y-1">
                <div>NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox | production</div>
                <div>NEXT_PUBLIC_SQUARE_APP_ID=sq0idp-... or sandbox-sq0idb-...</div>
                <div>NEXT_PUBLIC_SQUARE_LOCATION_ID=L...</div>
              </div>
            </div>
          )}
        </div>

        {/* Error / Success Message */}
        {message && !paymentSuccess && (
          <div className={`mx-5 mb-5 p-3 rounded-xl flex items-start gap-2 text-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Trust Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
            PCI-DSS Level 1 Certified
          </span>
          <span>Your card data never touches our servers</span>
        </div>
      </div>

      {/* Cancel */}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-700 py-1.5 font-medium transition"
        >
          Cancel & go back
        </button>
      )}
    </div>
  );
}
