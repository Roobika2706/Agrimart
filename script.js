// Function for Local Market to send an order
function sendOrder(event) {
  event.preventDefault(); // Prevent form reload

  let username = document.getElementById("username").value;
  let product = document.getElementById("product").value;
  let quantity = document.getElementById("quantity").value;

  if (username.trim() === "" || product.trim() === "" || quantity.trim() === "") {
    alert("Please fill all fields");
    return;
  }

  // Create message format
  let msg = `${username} is requesting order for ${product} (${quantity} quantity)`;

  // Save message in localStorage
  localStorage.setItem("farmerMessage", msg);

  alert("Order sent to Farmers!");

  // Clear form
  document.getElementById("username").value = "";
  document.getElementById("product").value = "";
  document.getElementById("quantity").value = "";
}

// Function for Farmers to read message
window.onload = function() {
  let box = document.getElementById("messageBox");
  if (box) {
    let msg = localStorage.getItem("farmerMessage");
    if (msg) {
      box.textContent = msg;
    }
  }
};
