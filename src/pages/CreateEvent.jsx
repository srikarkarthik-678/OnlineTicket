import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
  title: "",
  description: "",
  date: "",
  location: "",
  capacity: "",
  price: "",   // ✅ ADD THIS
});

  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date) return;

    setLoading(true);

    await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);
    navigate("/");
  };
   const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return (
      <div className="bg-black text-white h-screen flex items-center justify-center">
        <p>Access Denied. Admins only.</p>
      </div>
    );
  }

  const fields = [
  { name: "title", label: "Event Title", placeholder: "e.g. Design Summit 2025", type: "text" },
  { name: "description", label: "Description", placeholder: "What's this event about?", type: "text", textarea: true },
  { name: "date", label: "Date", type: "date" },
  { name: "location", label: "Location", placeholder: "e.g. Mumbai, Taj Hotel", type: "text" },
  { name: "capacity", label: "Capacity", placeholder: "e.g. 200", type: "number" },
  { name: "price", label: "Ticket Price (₹)", placeholder: "e.g. 500", type: "number" }, // ✅ ADD THIS
];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0] flex justify-center px-6 py-12 relative font-sans">

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_70%_10%,rgba(212,175,55,0.05)_0%,transparent_50%)]" />

      <div className="relative w-full max-w-[540px] flex flex-col gap-6">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="text-xs tracking-widest text-white/40 hover:text-white transition text-left"
        >
          ← Back to Events
        </button>

        {/* Heading */}
        <div className="flex flex-col gap-1">
          <p className="text-[11px] tracking-[0.3em] text-[#d4af37]">
            NEW EVENT
          </p>

          <h1 className="text-[36px] font-serif leading-tight">
            Create an Experience
          </h1>

          <p className="text-sm text-white/40">
            Fill in the details below to publish your event.
          </p>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/10" />

        {/* Form */}
        <div className="flex flex-col gap-5">

          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">

              <label className="text-[11px] uppercase tracking-[0.12em] text-white/50">
                {field.label}
              </label>

              {field.textarea ? (
                <textarea
                  name={field.name}
                  rows={3}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  onFocus={() => setFocused(field.name)}
                  onBlur={() => setFocused(null)}
                  className={`w-full p-3 text-sm bg-white/5 border border-white/10 outline-none transition
                  ${focused === field.name ? "border-[#d4af37]/40 bg-[#d4af37]/5" : ""}`}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  onFocus={() => setFocused(field.name)}
                  onBlur={() => setFocused(null)}
                  className={`w-full p-3 text-sm bg-white/5 border border-white/10 outline-none transition
                  ${focused === field.name ? "border-[#d4af37]/40 bg-[#d4af37]/5" : ""}`}
                />
              )}

            </div>
          ))}

        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/10" />

        {/* Actions */}
        <div className="flex justify-end gap-3">

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 text-sm border border-white/10 text-white/50 hover:border-white/40 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 text-sm font-medium tracking-wide transition
              ${loading
                ? "bg-yellow-700 text-black cursor-not-allowed"
                : "bg-[#d4af37] text-black hover:bg-[#c9a227]"
              }`}
          >
            {loading ? "Publishing…" : "Publish Event"}
          </button>

        </div>
      </div>
    </div>
  );
}