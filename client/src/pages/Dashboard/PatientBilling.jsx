import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

const Panel = ({ children, className = '' }) => (
  <section
    className={`rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(4,10,28,0.45)] backdrop-blur-xl ${className}`}
  >
    {children}
  </section>
);

const statusTone = {
  Paid: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200',
  Unpaid: 'border-rose-500/30 bg-rose-500/15 text-rose-200',
  Pending: 'border-amber-500/30 bg-amber-500/15 text-amber-200',
};

const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const PatientBilling = () => {
  const { user } = useAuth();
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingBill, setSubmittingBill] = useState(null);

  useEffect(() => {
    const fetchBilling = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const response = await apiRequest(`/api/patients/${user._id}/billing`);
        setBilling(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error('Failed to fetch billing:', err);
        setError('Failed to load billing information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, [user?._id]);

  const handleSubmitBill = async (billingId) => {
    try {
      setSubmittingBill(billingId);
      await apiRequest(`/api/patients/${user._id}/billing/${billingId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ paymentMethod: 'Credit Card' }),
      });

      setBilling((current) =>
        current.map((bill) => (bill._id === billingId ? { ...bill, paymentStatus: 'Paid' } : bill))
      );
    } catch (err) {
      console.error('Failed to submit bill:', err);
      alert('Failed to submit bill. Please try again.');
    } finally {
      setSubmittingBill(null);
    }
  };

  const paidTotal = useMemo(
    () => billing.filter((bill) => bill.paymentStatus === 'Paid').reduce((sum, bill) => sum + (bill.amount || 0), 0),
    [billing]
  );

  const unpaidTotal = useMemo(
    () => billing.filter((bill) => bill.paymentStatus === 'Unpaid').reduce((sum, bill) => sum + (bill.amount || 0), 0),
    [billing]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#10335b_0%,#08111f_48%,#030712_100%)] px-4 py-6 text-slate-100">
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-400">Loading billing information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#10335b_0%,#08111f_48%,#030712_100%)] px-4 py-6 text-slate-100">
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-rose-300">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#10335b_0%,#08111f_48%,#030712_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Panel className="overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.14),transparent_30%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                Patient Finance
              </span>
              <div className="space-y-3">
                <h1 className="font-serif text-4xl text-white sm:text-5xl">Billing & Payments</h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  Review invoices, monitor pending balances, and clear outstanding bills from a cleaner patient finance portal.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total Paid</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-300">{formatCurrency(paidTotal)}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Outstanding</p>
                <p className="mt-2 text-3xl font-semibold text-rose-300">{formatCurrency(unpaidTotal)}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Total Bills</p>
                <p className="mt-2 text-3xl font-semibold text-white">{billing.length}</p>
              </div>
            </div>
          </div>
        </Panel>

        {billing.length === 0 ? (
          <Panel className="text-center">
            <p className="text-lg font-semibold text-white">No bills found</p>
            <p className="mt-2 text-sm text-slate-400">You do not have any billing records available yet.</p>
          </Panel>
        ) : (
          <div className="grid gap-5">
            {billing.map((bill) => (
              <Panel key={bill._id}>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-white">{bill.invoiceNumber || bill._id}</h2>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                          statusTone[bill.paymentStatus] || 'border-white/10 bg-white/5 text-slate-300'
                        }`}
                      >
                        {bill.paymentStatus || 'Pending'}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Date</p>
                        <p className="mt-2 font-semibold text-white">
                          {new Date(bill.createdAt || bill.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Amount</p>
                        <p className="mt-2 font-semibold text-white">{formatCurrency(bill.amount)}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Description</p>
                        <p className="mt-2 text-sm text-slate-300">{bill.description || 'General medical billing'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => alert('Download functionality would be implemented here')}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10"
                    >
                      Download
                    </button>
                    {bill.paymentStatus === 'Unpaid' && (
                      <button
                        type="button"
                        onClick={() => handleSubmitBill(bill._id)}
                        disabled={submittingBill === bill._id}
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submittingBill === bill._id ? 'Processing...' : 'Pay Now'}
                      </button>
                    )}
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientBilling;
