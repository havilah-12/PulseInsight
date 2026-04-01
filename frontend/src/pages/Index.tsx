import { useState } from "react";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import WarningChart from "../components/DiseaseChart"; /* Reused filename */
import PatientList from "../components/CommentList";   /* Reused filename */
import Uploader from "../components/Uploader";
import { useQueryClient } from "@tanstack/react-query";
import { apiUrl } from "../lib/api";

const Index = () => {
  const queryClient = useQueryClient();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries();
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8 md:px-6">
        <section className="mb-10 overflow-hidden rounded-[32px] border border-indigo-100 bg-white shadow-xl">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_1.2fr_0.95fr]">
            <div className="flex flex-col justify-center border-b border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-8 lg:border-b-0 lg:border-r">
              <div className="mb-3 inline-flex w-fit rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700">
                PulseInsight Dashboard
              </div>
              <h2 className="mb-3 text-3xl font-bold text-slate-900">
                Turn raw lab data into clear patient insight.
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                Upload lab records in the center, review grouped patient profiles, and download polished reports in CSV or PDF.
              </p>
            </div>

            <div className="border-b border-indigo-100 bg-gradient-to-b from-slate-50 to-white p-6 lg:border-b-0 lg:px-8 lg:py-8">
              <Uploader onUploadSuccess={handleUploadSuccess} />
            </div>

            <div className="flex flex-col justify-center gap-4 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-8 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-indigo-100">Export</p>
                <h3 className="mt-2 text-2xl font-semibold">Ready-to-share reports</h3>
                <p className="mt-2 text-sm text-indigo-100">
                  Export complete analytics or patient-specific reports for review and follow-up.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={apiUrl("/export-report")} download>
                  <button className="rounded-xl border border-white/20 bg-white px-5 py-2.5 font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50">
                    Download CSV
                  </button>
                </a>
                <a href={apiUrl("/export-report/pdf")} download>
                  <button className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-white/20">
                    Download PDF
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <div key={refreshKey}>
          <StatsCards />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PatientList />
            </div>
            <div>
              <WarningChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
