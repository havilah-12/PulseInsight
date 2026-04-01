import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Activity, AlertTriangle, CheckCircle, ArrowLeft, ClipboardList, Download } from "lucide-react";
import Header from "../components/Header";
import ProfileAvatar from "../components/ProfileAvatar";
import BodyProfileGraphic from "../components/BodyProfileGraphic";

interface Parameter {
  name: string;
  value: string;
  status: string;
  remarks: string;
  suggestions: string;
}

interface Patient {
  id: number;
  name: string;
  age: string;
  status: string;
  photo_url?: string | null;
  parameters: Parameter[];
}

const PatientReport = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
    fetch(`${apiUrl}/patients/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setPatient)
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
            <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Patient Not Found</h2>
        <Link to="/" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const goodParams = patient.parameters.filter(p => p.status === "Good");
  const criticalParams = patient.parameters.filter((p) => p.status === "Critical");
  const warningParams = patient.parameters.filter((p) => p.status === "Warning");
  const actionParams = patient.parameters.filter(p => p.status !== "Good");
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  const groupedSections = [
    {
      title: "Critical Tests",
      subtitle: "Immediate attention recommended",
      items: criticalParams,
      titleClass: "text-red-700",
      iconClass: "text-red-600",
      cardClass: "border-l-red-500",
      badgeClass: "bg-red-500",
      remarksClass: "bg-red-50 border-red-100",
      suggestionsClass: "bg-rose-50 border-rose-100",
    },
    {
      title: "Warning Tests",
      subtitle: "Needs monitoring and follow-up",
      items: warningParams,
      titleClass: "text-amber-700",
      iconClass: "text-amber-600",
      cardClass: "border-l-amber-500",
      badgeClass: "bg-amber-500",
      remarksClass: "bg-amber-50 border-amber-100",
      suggestionsClass: "bg-blue-50 border-blue-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <a
            href={`${apiUrl}/patients/${patient.id}/export-report/pdf`}
            download
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700"
          >
            <Download className="h-4 w-4" />
            Download Patient PDF
          </a>
        </div>

        {/* Patient Header Card */}
        <Card className="shadow-lg border-none mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ClipboardList className="h-32 w-32" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex items-center gap-4">
                <ProfileAvatar name={patient.name} photoUrl={patient.photo_url} className="h-20 w-20 border-white/30" />
                <div>
                  <h1 className="text-4xl font-extrabold mb-2">{patient.name}</h1>
                  <div className="flex gap-3 items-center text-indigo-100">
                    <span className="text-lg">Age: {patient.age}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-300"></span>
                    <span className="text-lg">ID: #{patient.id}</span>
                  </div>
                </div>
              </div>
              <div>
                {patient.status === "warning" ? (
                  <Badge className="bg-red-500/20 text-white border-red-300/50 text-base py-1.5 px-4 backdrop-blur-sm">
                    <AlertTriangle className="h-5 w-5 mr-2"/> Action Required
                  </Badge>
                ) : (
                  <Badge className="bg-green-500/20 text-white border-green-300/50 text-base py-1.5 px-4 backdrop-blur-sm">
                    <CheckCircle className="h-5 w-5 mr-2"/> Healthy Profile
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          <BodyProfileGraphic name={patient.name} parameters={patient.parameters} />

          <section className="grid gap-4 md:grid-cols-3">
            <Card className="border-none shadow-sm">
              <CardContent className="p-5">
                <p className="text-sm text-gray-500">Total Tests</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{patient.parameters.length}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-5">
                <p className="text-sm text-gray-500">Attention Tests</p>
                <p className="mt-2 text-3xl font-bold text-red-600">{actionParams.length}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-5">
                <p className="text-sm text-gray-500">Stable Tests</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{goodParams.length}</p>
              </CardContent>
            </Card>
          </section>

          {groupedSections.map((section) =>
            section.items.length > 0 ? (
              <section key={section.title}>
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold flex items-center gap-3 ${section.titleClass}`}>
                    <Activity className={`h-7 w-7 ${section.iconClass}`} /> {section.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">{section.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {section.items.map((param, i) => (
                    <Card key={`${section.title}-${i}`} className={`border-l-4 shadow-md ${section.cardClass}`}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4">
                            <h3 className="text-xl font-bold text-gray-800">{param.name}</h3>
                            <Badge className={section.badgeClass}>{param.status}</Badge>
                          </div>
                          <div className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 font-mono font-bold text-gray-700">
                            Recorded: {param.value}
                          </div>
                        </div>

                        <div className="mt-4 grid gap-6 md:grid-cols-2">
                          <div className={`rounded-xl border p-4 ${section.remarksClass}`}>
                            <h4 className="mb-2 flex items-center gap-2 font-bold text-gray-800">
                              <AlertTriangle className="h-4 w-4" /> Clinical Remarks
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-700">
                              {param.remarks || "No specific clinical remarks provided."}
                            </p>
                          </div>

                          <div className={`rounded-xl border p-4 ${section.suggestionsClass}`}>
                            <h4 className="mb-2 flex items-center gap-2 font-bold text-gray-800">
                              <CheckCircle className="h-4 w-4" /> Suggestions & Next Steps
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-700">
                              {param.suggestions || "No specific action plan generated. Please consult a physician."}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ) : null
          )}

          {/* Healthy Section */}
          {goodParams.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold flex items-center gap-3 text-green-700 mb-6 mt-12">
                <CheckCircle className="h-7 w-7" /> Stable Parameters
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {goodParams.map((param, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-700">{param.name}</h4>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <span className="text-2xl font-mono text-gray-900">{param.value}</span>
                    </div>
                    {param.remarks && param.remarks !== "Mock evaluation (No API Key)" && (
                      <p className="text-xs text-gray-500 mt-2 truncate" title={param.remarks}>{param.remarks}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {actionParams.length === 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-8 rounded-2xl text-center mt-8 shadow-sm">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Perfect Bill of Health</h3>
              <p className="text-green-700 max-w-2xl mx-auto">
                No actionable warnings were flagged in this lab report. All scanned parameters reside comfortably within general population medians.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PatientReport;
