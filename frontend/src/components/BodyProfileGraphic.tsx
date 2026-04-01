interface Parameter {
  name: string;
  value: string;
  status: string;
}

interface BodyProfileGraphicProps {
  name: string;
  parameters: Parameter[];
}

const getRiskColor = (status: string) => {
  if (status === "Critical") return "#ef4444";
  if (status === "Warning") return "#f59e0b";
  return "#22c55e";
};

const BodyProfileGraphic = ({ name, parameters }: BodyProfileGraphicProps) => {
  const focusPoints = parameters.slice(0, 4);
  const criticalCount = parameters.filter((parameter) => parameter.status === "Critical").length;
  const warningCount = parameters.filter((parameter) => parameter.status === "Warning").length;

  return (
    <div className="relative rounded-3xl bg-slate-950 text-white overflow-hidden border border-slate-800 shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.25),_transparent_40%)]" />
      <div className="relative p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Body Profile</p>
            <h3 className="mt-1 text-xl font-semibold">{name}</h3>
          </div>
          <div className="text-right text-sm">
            <p className="text-red-300">{criticalCount} critical</p>
            <p className="text-amber-300">{warningCount} warnings</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
          <div className="mx-auto w-full max-w-[220px]">
            <svg viewBox="0 0 180 280" className="w-full drop-shadow-[0_0_18px_rgba(99,102,241,0.35)]">
              <defs>
                <linearGradient id="bodyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <circle cx="90" cy="34" r="24" fill="url(#bodyGlow)" opacity="0.9" />
              <rect x="60" y="66" width="60" height="88" rx="28" fill="url(#bodyGlow)" opacity="0.9" />
              <rect x="42" y="78" width="18" height="84" rx="9" fill="url(#bodyGlow)" opacity="0.7" />
              <rect x="120" y="78" width="18" height="84" rx="9" fill="url(#bodyGlow)" opacity="0.7" />
              <rect x="66" y="152" width="18" height="92" rx="9" fill="url(#bodyGlow)" opacity="0.75" />
              <rect x="96" y="152" width="18" height="92" rx="9" fill="url(#bodyGlow)" opacity="0.75" />

              {focusPoints.map((parameter, index) => {
                const dotPositions = [
                  { x: 90, y: 40 },
                  { x: 90, y: 98 },
                  { x: 70, y: 170 },
                  { x: 110, y: 170 },
                ];
                const labelPositions = [
                  { x: 132, y: 30 },
                  { x: 132, y: 96 },
                  { x: 10, y: 176 },
                  { x: 132, y: 176 },
                ];
                const dot = dotPositions[index];
                const label = labelPositions[index];

                return (
                  <g key={`${parameter.name}-${index}`}>
                    <circle cx={dot.x} cy={dot.y} r="8" fill={getRiskColor(parameter.status)} />
                    <line
                      x1={dot.x}
                      y1={dot.y}
                      x2={label.x + (label.x < dot.x ? 40 : 0)}
                      y2={label.y - 6}
                      stroke={getRiskColor(parameter.status)}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <text x={label.x} y={label.y} fill="#e2e8f0" fontSize="10" fontWeight="600">
                      {parameter.name}
                    </text>
                    <text x={label.x} y={label.y + 14} fill="#94a3b8" fontSize="9">
                      {parameter.value}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-slate-300">
              React-generated body profile showing the most important test markers for this patient.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Critical", count: criticalCount, color: "text-red-300 border-red-400/30 bg-red-500/10" },
                { label: "Warning", count: warningCount, color: "text-amber-300 border-amber-400/30 bg-amber-500/10" },
                { label: "Good", count: parameters.filter((parameter) => parameter.status === "Good").length, color: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10" },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl border p-3 ${item.color}`}>
                  <p className="text-xs uppercase tracking-wide">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyProfileGraphic;
