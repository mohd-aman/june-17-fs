import { useState } from "react";

export default function OrderForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [showForm, setShowForm] = useState(true);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSubmission = (e) => {
    e.preventDefault();
    setShowForm(false);
  };

  if (showForm) {
    return (
      <form onSubmit={handleSubmission}>
        <label>
          {" "}
          Name :
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <label>
          Email :
          <input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <label>
          {" "}
          Address :
          <input type="text" value={address} onChange={handleAddressChange} />
        </label>
        <button type="submit">Place Order</button>
      </form>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#e8f5e9",
        borderRadius: "8px",
      }}
    >
      <h3>Order Confirmed!</h3>
      <p>Thank you, {name}!</p>
      <p>Confirmation will be sent to {email}.</p>
      <p>Shipping to: {address}</p>
    </div>
  );
}
