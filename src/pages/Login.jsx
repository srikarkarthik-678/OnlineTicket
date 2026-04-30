import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="border border-white/20 p-8 w-[350px]">
        <h2 className="text-2xl mb-6 font-serif">Login</h2>
        <input placeholder="Email" className="w-full p-2 mb-3 bg-black border border-white/20" onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 bg-black border border-white/20" onChange={(e)=>setForm({...form,password:e.target.value})}/>
        <button onClick={handleLogin} className="w-full border border-[#d4af37] text-[#d4af37] py-2 hover:bg-[#d4af37] hover:text-black">
          Login
        </button>
      </div>
    </div>
  );
}