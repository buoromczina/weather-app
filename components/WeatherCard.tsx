type Props = {
  label: string;
  value: string;
  unit: string;
  hint?: string;
};

export default function WeatherCard({ label, value, unit, hint }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-2xl font-semibold text-slate-800">
        {value}
        <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
      </span>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );
}
