import React, { useEffect, useState } from 'react';
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
  Ready: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200',
  Pending: 'border-amber-500/30 bg-amber-500/15 text-amber-200',
  Reviewed: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-200',
};

const PatientLabResults = () => {
  const { user } = useAuth();
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabResults = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const response = await apiRequest(`/api/patients/${user._id}/lab-results`);
        setLabResults(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error('Failed to fetch lab results:', err);
        setError('Failed to load lab results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLabResults();
  }, [user?._id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#10335b_0%,#08111f_48%,#030712_100%)] px-4 py-6 text-slate-100">
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-400">Loading lab results...</div>
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
          <div className="relative space-y-4">
            <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Diagnostics Archive
            </span>
            <div className="space-y-3">
              <h1 className="font-serif text-4xl text-white sm:text-5xl">Lab Results</h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Review your test outcomes, track review status, and download copies for follow-up care.
              </p>
            </div>
          </div>
        </Panel>

        {labResults.length === 0 ? (
          <Panel className="text-center">
            <p className="text-lg font-semibold text-white">No lab results found</p>
            <p className="mt-2 text-sm text-slate-400">You do not have any laboratory reports available yet.</p>
          </Panel>
        ) : (
          <div className="grid gap-5">
            {labResults.map((result) => (
              <Panel key={result._id}>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-white">{result.testName}</h2>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                          statusTone[result.status] || 'border-white/10 bg-white/5 text-slate-300'
                        }`}
                      >
                        {result.status || 'Pending'}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Collected</p>
                        <p className="mt-2 font-semibold text-white">
                          {result.date
                            ? new Date(result.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : 'N/A'}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Reference Range</p>
                        <p className="mt-2 text-sm text-slate-300">{result.referenceRange || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Result</p>
                      <p className="mt-2 text-sm leading-7 text-slate-200">{result.result || 'Pending review'}</p>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => alert('Download functionality would be implemented here')}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                    >
                      Download
                    </button>
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

export default PatientLabResults;
