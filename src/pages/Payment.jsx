import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const user = JSON.parse(localStorage.getItem("user"));
  if (!event) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <p>No event selected</p>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: event.price, // ✅ send event price
        }),
      });

      const order = await res.json();

      const options = {
        key: "rzp_test_Si7bDm7aWWNb78",
        amount: order.amount,
        currency: order.currency,
        name: "Event Booking",
        description: event.title,

        handler: async function () {

          await fetch("http://localhost:5000/api/tickets/book", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              eventId: event._id,
              email: user.email,
            }),
          });

          alert("✅ Payment successful! Ticket sent to your email.");
          navigate("/");
        },

        theme: {
          color: "#d4af37",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center">

      <div className="border border-white/20 p-10 w-[400px]">

        <p className="text-[11px] tracking-[0.3em] text-[#d4af37]">
          CHECKOUT
        </p>

        <h1 className="text-3xl font-serif mt-2">
          Confirm Your Booking
        </h1>

        <div className="mt-6 space-y-2 text-white/70">
          <p><strong>Event:</strong> {event.title}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p className="text-[#d4af37] text-lg">
            <strong>Price:</strong> ₹ {event.price}
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handlePayment}
            className="w-full border border-[#d4af37] text-[#d4af37] py-3 hover:bg-[#d4af37] hover:text-black transition"
          >
            Pay ₹{event.price} {/* ✅ dynamic */}
          </button>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full border border-white/20 py-2 hover:bg-white hover:text-black transition"
        >
          Cancel
        </button>

      </div>
    </div>
  );
} 