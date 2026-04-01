import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Users, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  age: string;
  status: string;
}

const PatientList = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
    fetch(`${apiUrl}/patients`)
      .then((res) => res.json())
      .then(setPatients)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-2xl rounded-2xl border-transparent">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <CardTitle>Loading Patients...</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
            <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
            <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl rounded-2xl border-none bg-white/80 backdrop-blur-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl">Patient Directory</span>
          </div>
          <Badge className="bg-white text-indigo-700 shadow-sm border-none px-3 py-1 text-sm font-semibold">
            {patients.length} Patients
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 overflow-y-auto max-h-[800px] space-y-4 bg-gray-50/50">
        {patients.length === 0 && (
          <div className="text-center py-12 text-gray-400 flex flex-col items-center">
            <Users className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">No patient records found.</p>
            <p className="text-sm">Please upload a CSV file to begin analysis.</p>
          </div>
        )}

        {patients.map((p) => {
          return (
            <div 
              key={p.id} 
              className="rounded-2xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-300 shadow-sm overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <h3 className="font-bold text-gray-800 text-lg sm:text-xl">
                    {p.name}
                  </h3>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 w-fit">
                    Age: {p.age}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  {p.status === "warning" ? (
                    <Badge className="bg-red-50 text-red-700 border-red-200 shadow-sm py-1 px-3">
                      <AlertTriangle className="h-4 w-4 mr-1.5 text-red-500"/> Action Needed
                    </Badge>
                  ) : (
                    <Badge className="bg-green-50 text-green-700 border-green-200 shadow-sm py-1 px-3">
                      <CheckCircle className="h-4 w-4 mr-1.5 text-green-500"/> Healthy Status
                    </Badge>
                  )}
                  
                  <Link 
                    to={`/patient/${p.id}`} 
                    target="_blank"
                    className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg"
                  >
                    View Report <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PatientList;
