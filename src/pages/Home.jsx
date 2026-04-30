import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await fetch("http://localhost:5000/api/events");
    const data = await res.json();
    setEvents(data);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleReserve = (event) => {
    if (!user) {
      navigate("/signup");
      return;
    }
    navigate("/payment", { state: { event } });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="bg-black min-h-screen text-white">

      {/* HEADER */}
      <div className="max-w-[1200px] mx-auto pt-10 px-6">

        <p className="text-[11px] tracking-[0.3em] text-[#d4af37]">
          DISCOVER
        </p>

        <div className="flex justify-between items-center mt-2">
          <h1 className="text-5xl font-serif">
            Upcoming Events
          </h1>

          <div className="flex gap-3 items-center">

            {user && user.role === "admin" && (
              <button
                onClick={() => navigate("/create")}
                className="border border-white px-5 py-2 hover:bg-white hover:text-black transition"
              >
                + Create Event
              </button>
            )}

            {user ? (
              <>
                <span className="text-[#d4af37]">
                  👤 {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="border border-[#d4af37] px-3 py-1 text-xs hover:bg-[#d4af37] hover:text-black"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/signup")}
                  className="border border-white px-4 py-2 hover:bg-white hover:text-black"
                >
                  Sign Up
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="border border-[#d4af37] text-[#d4af37] px-4 py-2 hover:bg-[#d4af37] hover:text-black"
                >
                  Login
                </button>
              </>
            )}

          </div>
        </div>

        <div className="h-[1px] bg-white/20 mt-6"></div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {events.length === 0 ? (
          <p className="text-white/40">No events available</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((e, i) => (
              <div key={e._id} className="border border-white/20 p-6 hover:border-[#d4af37]">

                <p className="text-[#d4af37] text-xs">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="text-2xl mt-2 font-serif">{e.title}</h2>
                <p className="text-white/50 text-sm mt-2">
                  {e.description}
                </p>
                <div className="mt-4 text-white/50 text-sm">
                  <p>📅 {formatDate(e.date)}</p>
                  <p>📍 {e.location}</p>
                  <p>👥 {e.capacity} seats</p>
                  <p className="text-[#d4af37] font-medium">₹ {e.price}</p> {/* ✅ NEW */}
                </div>
                <button
                  onClick={() => handleReserve(e)}
                  className="mt-6 w-full border border-[#d4af37] text-[#d4af37] py-2 hover:bg-[#d4af37] hover:text-black"
                >
                  Reserve a Seat
                </button>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}