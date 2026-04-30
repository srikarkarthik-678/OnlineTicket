<html>
<body style="font-family:sans-serif; text-align:center;">

<h2>🎟 Event Ticket</h2>

<p>Email: <%= request.getParameter("email") %></p>

<img 
  src="<%= request.getParameter("qr") %>" 
  style="width:200px;"
/>

<p>Show this QR at entry</p>

</body>
</html>