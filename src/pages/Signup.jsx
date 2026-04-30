import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("User already exists!");
      return;
    }

    alert("Signup successful!");
    navigate("/login");
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center text-white">
      
      <div className="border border-white/20 p-8 w-[350px]">
              <h2 className="text-2xl mb-6 font-serif text-center">
          Sign Up
        </h2>
        <input
          placeholder="Name"
          className="w-full p-2 mb-3 bg-black border border-white/20 outline-none focus:border-[#d4af37]"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          className="w-full p-2 mb-3 bg-black border border-white/20 outline-none focus:border-[#d4af37]"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-black border border-white/20 outline-none focus:border-[#d4af37]"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* SIGNUP BUTTON */}
        <button
          onClick={handleSignup}
          className="w-full border border-[#d4af37] py-2 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
        >
          Sign Up
        </button>

        {/* LOGIN LINK */}
        <p className="mt-4 text-sm text-white/50 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#d4af37] cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}