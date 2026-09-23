export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center gap-3 text-[#4E5E59]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#D8D1C4] border-t-[#2F5D50]" />
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </div>
  );
}
