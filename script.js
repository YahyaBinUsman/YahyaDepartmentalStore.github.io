// Retrieve the cart from local storage or initialize an empty array
var cart = JSON.parse(localStorage.getItem('cart')) || [];
// Flag to indicate whether the checkout has been processed
var isCheckoutProcessed = false;
function addToCart(productName, price, quantityInputId, section) {
    var quantity = parseFloat(document.getElementById(quantityInputId).value);
    if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity greater than zero.");
        return;
    }

    // Call the calculatePrice function based on the section
    var totalCost = calculatePrice(price, quantity, section);

    var confirmed = confirm(`Are you sure you want to add ${quantity} units of ${productName} to the cart?`);
    if (confirmed) {
        cart.push({ name: productName, price: price, quantity: quantity, cost: totalCost, section: section });
        updateCart();
        saveCartToLocalStorage();
    }
}


function toggleTheme() {
    var body = document.body;
    body.dataset.bsTheme = (body.dataset.bsTheme === 'light') ? 'dark' : 'light';
}
// Function to calculate the total cost based on the section
function calculatePrice(basePrice, quantity, section) {
    // Customize the logic based on the section
    if (section === 'clothes') {
        // Add logic for calculating prices for clothes with size
        var size = document.getElementById('size').value;

        if (size === 'medium') {
            return (basePrice * quantity * 1.1).toFixed(2);
        } else if (size === 'large') {
            return (basePrice * quantity * 1.2).toFixed(2);
        } else if (size === 'xl') {
            return (basePrice * quantity * 1.3).toFixed(2);
        } else {
            return (basePrice * quantity).toFixed(2);
        }
    } else {
        // Default calculation for other sections
        return (basePrice * quantity).toFixed(2);
    }
}

// Function to remove a product from the cart
function removeFromCart(index) {
    var removedItem = cart.splice(index, 1)[0];
    updateCart();
    saveCartToLocalStorage();
}

// Function to update the displayed cart in the HTML
function updateCart() {
    var cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';

    cart.forEach(function (item, index) {
        var cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <p>${item.name} - Quantity: ${item.quantity} units, Total Cost: $${item.cost} <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button></p>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

// Function to save the cart to local storage and trigger a custom event
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));

    // Trigger a custom event to notify other tabs/windows
    var event = new Event('cartUpdated');
    window.dispatchEvent(event);
}

// Listen for the 'cartUpdated' event in other tabs/windows
window.addEventListener('storage', function (event) {
    if (event.key === 'cart' && event.newValue) {
        cart = JSON.parse(event.newValue);
        updateCart();
    }
});

// Update the cart when the page is loaded
window.addEventListener('DOMContentLoaded', function () {
    updateCart();
});

// Function to process the checkout
function processCheckout() {
    // Get user input for address, phone, and name
    var address = document.getElementById('address').value;
    var phone = document.getElementById('phone').value;
    var name = document.getElementById('name').value;

    // Validate required fields
    if (!address || !phone || !name) {
        alert('Please fill in all required fields.');
        return;
    }

    // Calculate subtotal, tax, and total
    var subtotal = cart.reduce(function (acc, item) {
        return acc + parseFloat(item.cost); // Use parseFloat to ensure a valid number
    }, 0);

    var tax = subtotal * 0.17; // Use consistent tax rate
    var total = subtotal + tax;

    // Display the checkout details in the HTML
    var checkoutDetails = document.getElementById('checkoutItems');
    checkoutDetails.innerHTML = `
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Tax (17%): $${tax.toFixed(2)}</p>
        <p>Total: $${total.toFixed(2)}</p>
        <p>Delivery Address: ${address}</p>
        <p>Phone Number: ${phone}</p>
        <p>Full Name: ${name}</p>
    `;

    // Clear the cart and local storage
    cart = [];
    saveCartToLocalStorage();

    // Trigger a custom event to update other tabs/windows
    var event = new Event('cartUpdated');
    window.dispatchEvent(event);
}
function clearCart() {
    var confirmed = confirm("Are you sure you want to clear the entire cart?");
    if (confirmed) {
        cart = [];
        updateCart();
        saveCartToLocalStorage();
    }
}
