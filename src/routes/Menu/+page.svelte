<script lang="ts">
    let selectedPaymentMethod = '';
    import { writable } from 'svelte/store';
    let showOrderHistoryPanel = false;

    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { orderHistory } from '$lib/stores';
    // Data for drinks with correct image paths
    const drinks = [
      { id: 1, name: 'มัคคิอาโต้', englishName: 'Macchiato', price: 60, image: '/src/images/macchiato.png' },
      { id: 2, name: 'ลาเต้', englishName: 'Latte', price: 55, image: '/src/images/latte.png' },
      { id: 3, name: 'มอคค่า', englishName: 'Mocha', price: 60, image: '/src/images/mocha.png' },
      { id: 4, name: 'มัคคิอาโต้', englishName: 'Macchiato', price: 40, image: '/src/images/macchiato.png' },
      { id: 5, name: 'มัคคิอาโต้', englishName: 'Macchiato', price: 40, image: '/src/images/macchiato.png' },
      { id: 6, name: 'ชานม', englishName: 'ชานม', price: 40, image: '/src/images/macchiato.png' },
    ];
  
    // Order system
    let orderItems = [
    //   { id: 1, name: 'มัคคิอาโต้', englishName: 'Macchiato', price: 60, quantity: 1, image: '/src/images/macchiato.png' },
    //   { id: 2, name: 'ลาเต้', englishName: 'Latte', price: 55, quantity: 1, image: '/src/images/latte.png' },
    //   { id: 3, name: 'มอคค่า', englishName: 'Mocha', price: 60, quantity: 1, image: '/src/images/mocha.png' }
    ];
    
    // Calculate total
    $: total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    $: finalTotal = total - discount;
    
    // Add drink to order
    function addToOrder(drink) {
      const existingItem = orderItems.find(item => item.id === drink.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
        orderItems = [...orderItems]; // Trigger reactivity
      } else {
        orderItems = [...orderItems, { ...drink, quantity: 1 }];
      }
    }
    
    // Remove item from order
    function removeOrderItem(id) {
      orderItems = orderItems.filter(item => item.id !== id);
    }
    
    // Change quantity
    function updateQuantity(id, newQuantity) {
      if (newQuantity < 1) return;
      
      const item = orderItems.find(item => item.id === id);
      if (item) {
        item.quantity = newQuantity;
        orderItems = [...orderItems]; // Trigger reactivity
      }
    }
  
    // Show order panel
    let showOrderPanel = false;
    let showPaymentPanel = false;
    
    function toggleOrderPanel() {
      showOrderPanel = !showOrderPanel;
    }
    
// Navigate to profile
function goToProfile() {
    goto('/Profile');
}

// Continue to payment
function goToPayment() {
    if (orderItems.length === 0) {
        alert('กรุณาเลือกสินค้าก่อนทำการชำระเงิน');
    } else {
        showPaymentPanel = true; 
        // Implementation would go here
    }
}
    
    const categories = ['Coffee', 'Tea', 'Milk', 'Soda'];
    let selectedCategory = 'Coffee';
    let currentDate = new Date();
    
    // Format date: Friday, 20 May 2024
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  
    // Sort functionality
    let sortDropdownOpen = false;
    const toggleSortDropdown = () => {
      sortDropdownOpen = !sortDropdownOpen;
    };
    
    // Function to handle image errors
    function handleImageError(event) {
      event.target.src = "https://via.placeholder.com/100x100?text=Coffee";
    }
    function handlePaymentConfirm() {
      const totalDrinks = orderItems.reduce((sum, item) => sum + item.quantity, 0);
      const duration = totalDrinks * 60; // 60 วินาทีต่อแก้ว

        const newOrder = {
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            items: [...orderItems],
            total: finalTotal.toFixed(2),
            date: new Date(),
            paymentMethod: selectedPaymentMethod,
            startTime: Date.now(),  // เก็บเวลาเริ่มต้น
            duration: duration  
        };
        
        // Update store
        orderHistory.update(history => [...history, newOrder]);
        
        // Clear current order and reset
        orderItems = [];
        showPaymentPanel = false;
        showOrderPanel = false;
        alert('Comfirmed Your can see order at Order History');
        selectedPaymentMethod = 'credit-card';
    }

    function selectPaymentMethod(method: string) {
        selectedPaymentMethod = method;
        console.log('Selected payment method:', method); // เพื่อ debug
    }

    let couponCode = '';
    let discount = 0;
    let isValidCoupon = false;

    function applyCoupon() {
        if (couponCode === 'DISCOUNT10') {
            discount = total * 0.1; // 10% discount
            isValidCoupon = true;
            alert('Coupon applied successfully! 10% discount');
        } else {
            discount = 0;
            isValidCoupon = false;
            alert('Invalid coupon code');
        }
    }

    let firstName = '';
    let lastName = '';
    let mobileNumber = '';
    let email = '';
    let currentPassword = '';
    let newPassword = '';

    function saveProfile() {
        alert('Profile saved successfully!');
        // Add logic to save profile details
    }

    function verifyEmail() {
        alert('Verification email sent!');
        // Add logic to send verification email
    }

    function saveEmail() {
        alert('Email updated successfully!');
        // Add logic to update email
    }

    function savePassword() {
        alert('Password updated successfully!');
        // Add logic to update password
    }
  </script>
  
  <div class="auto-cafe {showOrderPanel ? 'with-order-panel' : ''}">
    <div class="main-content">
      <header>
        <div class="header-left">
          <div class="profile-icon" on:click={goToProfile}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#A0A0A0"/>
            </svg>
        </div>
          <div class="title-container">
            <h1>Auto Cafe</h1>
            <p class="date">{formattedDate}</p>
          </div>
        </div>
      </header>
  
      <nav class="categories">
        {#each categories as category}
          <button 
            class={selectedCategory === category ? 'active' : ''} 
            on:click={() => selectedCategory = category}
          >
            {category}
          </button>
        {/each}
      </nav>
  
      <div class="drinks-header">
        <h2>Choose Drinks</h2>
        <div class="sort-container">
          <button class="sort-button" on:click={toggleSortDropdown}>
            Sort
            <svg class={sortDropdownOpen ? 'arrow rotated' : 'arrow'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10H7Z" fill="#333"/>
            </svg>
          </button>
          {#if sortDropdownOpen}
            <div class="sort-dropdown">
              <div class="sort-option">Price: Low to High</div>
              <div class="sort-option">Price: High to Low</div>
              <div class="sort-option">Name: A to Z</div>
            </div>
          {/if}
        </div>
      </div>
  
      <div class="drinks-grid">
        {#each drinks as drink}
          <div class="drink-card" on:click={() => addToOrder(drink)}>
            <div class="drink-image">
              <img 
                src={drink.image} 
                alt={drink.englishName}
                on:error={handleImageError}
              />
            </div>
            <div class="drink-info">
              <div class="drink-name">{drink.name}</div>
              <div class="drink-english-name">{drink.englishName}</div>
              <div class="drink-price">฿ {drink.price}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  
    <!-- Order Panel -->
    {#if showOrderPanel}
      <div class="order-panel">
        <div class="order-header">
          <button class="back-button" on:click={toggleOrderPanel}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#333"/>
            </svg>
          </button>
          <h2>Order</h2>
        </div>


        <div class="order-list-header">
          <div class="item-label">Item</div>
          <div class="qty-label">Qty</div>
        </div>
  
        <div class="order-items">
          {#each orderItems as item}
            <div class="order-item">
    <div class="item-info">
        <div class="item-image">
            <img 
                src={item.image} 
                alt={item.englishName} 
                on:error={handleImageError}
            />
        </div>
        <div class="item-details">
            <div class="item-name">{item.englishName}</div>
            <div class="item-price">฿{item.price}</div>
        </div>
    </div>
    
    <div class="item-actions">
        <div class="quantity-control">
            <button 
                class="quantity-btn minus"
                on:click={() => updateQuantity(item.id, item.quantity - 1)}
            >
                -
            </button>
            <input 
                type="number" 
                min="1" 
                bind:value={item.quantity}
                on:change={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            />
            <button 
                class="quantity-btn plus"
                on:click={() => updateQuantity(item.id, item.quantity + 1)}
            >
                +
            </button>
        </div>
        <button class="remove-button" on:click={() => removeOrderItem(item.id)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#FF5252"/>
            </svg>
        </button>
    </div>
</div>

          {/each}
        </div>
  
        <div class="coupon-section">
    <div class="coupon-input">
        <input 
            type="text" 
            placeholder="Enter coupon code" 
            bind:value={couponCode}
            class="coupon-field"
        />
        <button class="apply-coupon" on:click={applyCoupon}>
            Apply
        </button>
    </div>
    {#if isValidCoupon}
        <div class="discount-info">
            <span>Discount</span>
            <span>-฿{discount.toFixed(2)}</span>
        </div>
    {/if}
</div>

<div class="order-footer">
    <div class="total-section">
        <div class="subtotal">
            <span class="total-label">Subtotal</span>
            <span class="total-amount">฿{total.toFixed(2)}</span>
        </div>
        {#if isValidCoupon}
            <div class="discount">
                <span class="total-label">Discount</span>
                <span class="total-amount discount">-฿{discount.toFixed(2)}</span>
            </div>
        {/if}
        <div class="final-total">
            <span class="total-label">Total</span>
            <span class="total-amount">฿{finalTotal.toFixed(2)}</span>
        </div>
    </div>
    <button class="payment-button" on:click={goToPayment}>
        Continue to Payment
    </button>
</div>
        
    
      </div>
    {/if}

    {#if showPaymentPanel}
    <div class="payment-panel">
      <div class="order-header">
        <button class="back-button" on:click={() => showPaymentPanel = false}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83L13.42L5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#333"/>
          </svg>
        </button>
        <h2>Payment</h2>
      </div>
      
      <div class="payment-content">
        <div class="payment-details">
            <div class="payment-method-section">
                <label>Payment Method</label>
                <div class="payment-icons">
                    <button 
                        class="payment-icon-btn {selectedPaymentMethod === 'credit-card' ? 'selected' : ''}" 
                        on:click={() => selectPaymentMethod('credit-card')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor"/>
                        </svg>
                        <span>Credit Card</span>
                    </button>
                    <button 
                        class="payment-icon-btn {selectedPaymentMethod === 'E-wallet' ? 'selected' : ''}" 
                        on:click={() => selectPaymentMethod('E-wallet')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.2 5H4.8C3.81 5 3.01 5.81 3.01 6.8L3 17.2C3 18.19 3.81 19 4.8 19H19.2C20.19 19 21 18.19 21 17.2V6.8C21 5.81 20.19 5 19.2 5ZM19.2 17.2H4.8V11H19.2V17.2ZM19.2 8H4.8V6.8H19.2V8Z" fill="currentColor"/>
                        </svg>
                        <span>E-wallet</span>
                    </button>
                    <button 
                        class="payment-icon-btn {selectedPaymentMethod === 'Promptpay' ? 'selected' : ''}" 
                        on:click={() => selectPaymentMethod('Promptpay')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.31 11.14C10.54 10.69 9.97 10.2 9.97 9.47C9.97 8.63 10.76 8.04 12.07 8.04C13.45 8.04 13.97 8.7 14.01 9.68H15.72C15.67 8.34 14.85 7.11 13.23 6.71V5H10.9V6.69C9.39 7.01 8.18 7.99 8.18 9.5C8.18 11.29 9.67 12.19 11.84 12.71C13.79 13.17 14.18 13.86 14.18 14.58C14.18 15.11 13.79 15.97 12.08 15.97C10.48 15.97 9.85 15.25 9.76 14.33H8.04C8.14 16.03 9.4 16.99 10.9 17.3V19H13.23V17.33C14.75 17.04 15.97 16.17 15.97 14.56C15.97 12.36 14.08 11.59 12.31 11.14Z" fill="currentColor"/>
                        </svg>
                        <span>Promptpay</span>
                    </button>
                </div>
                {#if selectedPaymentMethod === 'credit-card'}
        <div class="card-info-form">
            <div class="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" maxlength="19" />
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" maxlength="5" />
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" maxlength="3" />
                </div>
            </div>
            <div class="form-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="Name on card" />
            </div>
        </div>
    {/if}
{#if selectedPaymentMethod === 'Promptpay'}
    <div class="promptpay-section">
        <div class="qr-container">
            <img src="/src/images/qr-sample.png" alt="PromptPay QR Code" class="qr-code" />
            <div class="qr-info">
                <p class="promptpay-number">PromptPay: 000-000-0000</p>
                <p class="total-amount">Amount: ฿{finalTotal.toFixed(2)}</p>
            </div>
        </div>
        <div class="payment-instructions">
            <h4>How to pay:</h4>
            <ol>
                <li>Open your banking app</li>
                <li>Scan this QR code</li>
                <li>Verify the amount</li>
                <li>Complete the payment</li>
            </ol>
        </div>
    </div>
{/if}
              </div>

        <div class="payment-summary">
            <div class="summary-item">
                <span>Subtotal</span>
                <span>฿ {total}</span>
            </div>
            <div class="summary-item">
                <span>เครื่องดื่มรวมภาษีมูลค่าเพิ่มแล้ว</span>
            </div>
        </div>
    </div>
</div>
      <div class="order-footer">
        <div class="total-section">
          <div class="total-label">Total Amount</div>
          <div class="total-amount">฿ {finalTotal.toFixed(2)}</div>
        </div>
        <button class="payment-button" on:click={handlePaymentConfirm}>
            Confirm Payment
        </button>
      </div>
    </div>
  {/if}

  
    <nav class="sidebar">
      <div class="sidebar-item home">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="#333"/>
        </svg>
      </div>
      <div class="sidebar-item cart" on:click={toggleOrderPanel}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="#333"/>
        </svg>
        {#if orderItems.length > 0}
          <div class="cart-badge">{orderItems.reduce((sum, item) => sum + item.quantity, 0)}</div>
        {/if}
      </div>
      <div class="sidebar-item order-history" on:click={() => goto('/History')}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z" fill="currentColor"/>
        </svg>
        <span class="tooltip">Order History</span>
    </div>

      {#if showOrderHistoryPanel}
        <div class="order-history-panel">
            <div class="order-header">
                <button class="back-button" on:click={toggleOrderHistory}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 11H7.83L13.42L5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#333"/>
                    </svg>
                </button>
                <h2>Order History</h2>
            </div>
            <div class="history-content">
                {#if $orderHistory.length > 0}
                    {#each $orderHistory as order}
                        <div class="history-item">
                            <div class="history-header">
                                <span class="order-id">#{order.id}</span>
                                <span class="order-date">{new Date(order.date).toLocaleString()}</span>
                            </div>
                            <div class="history-items">
                                {#each order.items as item}
                                    <div class="history-item-detail">
                                        <span>{item.englishName} × {item.quantity}</span>
                                        <span>฿{item.price * item.quantity}</span>
                                    </div>
                                {/each}
                            </div>
                            <div class="history-footer">
                                <span class="payment-method">{order.paymentMethod}</span>
                                <span class="total">฿{order.total}</span>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <div class="empty-history">
                        <p>No order history yet</p>
                    </div>
                {/if}
            </div>
        </div>
      {/if}
      <div class="sidebar-item settings">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="#333"/>
        </svg>
      </div>
    </nav>
  </div>

  <div class="profile-page">
    <section class="profile-section">
        <h2>My Profile</h2>
        <div class="form-group">
            <input type="text" placeholder="First Name" bind:value={firstName} />
        </div>
        <div class="form-group">
            <input type="text" placeholder="Last Name" bind:value={lastName} />
        </div>
        <div class="form-group">
            <input type="text" placeholder="Mobile Number" bind:value={mobileNumber} />
        </div>
        <button class="save-button" on:click={saveProfile}>Save</button>
    </section>

    <hr />

    <section class="email-section">
        <h2>Email</h2>
        <div class="form-group">
            <input type="email" placeholder="Email" bind:value={email} />
        </div>
        <div class="button-group">
            <button class="verify-button" on:click={verifyEmail}>Verify Email</button>
            <button class="save-button" on:click={saveEmail}>Save</button>
        </div>
    </section>

    <hr />

    <section class="password-section">
        <h2>Password</h2>
        <div class="form-group">
            <input type="password" placeholder="Current Password" bind:value={currentPassword} />
        </div>
        <div class="form-group">
            <input type="password" placeholder="New Password" bind:value={newPassword} />
        </div>
        <button class="save-button" on:click={savePassword}>Save</button>
    </section>
</div>
  
  <style>
  /* Base styles */
  .auto-cafe {
    font-family: 'Arial', sans-serif;
    max-width: 1440px;
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    position: relative;
    background-color: white;
  }

  /* Main content area */
  .main-content {
    flex: 1;
    padding: 20px;
    padding-left: 80px;
    transition: width 0.3s ease;
    overflow-y: auto;
    height: 100%;
  }

  /* Panels */
  .payment-panel,
  .order-panel,
  .order-history-panel {
    width: 350px;
    height: 100vh;
    background-color: #f5f5f5;
    position: fixed;
    right: 0;
    top: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
  }

  .payment-panel {
    z-index: 999;
  }

  .order-panel {
    z-index: 998;
  }

  .order-history-panel {
    z-index: 997;
  }

  /* Sidebar */
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 60px;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    z-index: 1000;
  }

  /* Forms */
  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #333;
  }

  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }

  /* Buttons */
  .payment-button,
  .auth-button {
    width: 100%;
    padding: 10px 20px;
    background-color: #795548;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .payment-button:hover,
  .auth-button:hover {
    background-color: #5d4037;
  }

  /* Media Queries */
  @media (max-width: 768px) {
    .auto-cafe {
      flex-direction: column;
    }

    .main-content {
      width: 100% !important;
      padding-left: 20px;
      padding-bottom: 80px;
    }

    .sidebar {
      height: 60px;
      width: 100%;
      bottom: 0;
      top: auto;
      flex-direction: row;
      justify-content: space-around;
      padding: 0;
    }

    .payment-panel,
    .order-panel,
    .order-history-panel {
      width: 100%;
      height: calc(100vh - 60px);
      bottom: 60px;
      top: auto;
    }
  }
  .with-order-panel .main-content {
      width: calc(100% - 350px);
    }
  
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
  
    .header-left {
      display: flex;
      align-items: center;
    }
  
    .profile-icon {
      width: 40px;
      height: 40px;
      background-color: #f0f0f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
    }
  
    .profile-icon svg {
      width: 24px;
      height: 24px;
    }
  
    .title-container h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
  
    .date {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
  
    .categories {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
  
    .categories button {
      background: none;
      border: none;
      padding: 10px 0;
      cursor: pointer;
      font-size: 16px;
      color: #666;
      position: relative;
    }
  
    .categories button.active {
      color: #000;
      font-weight: bold;
    }
  
    .categories button.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #000;
    }
  
    .drinks-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
  
    .drinks-header h2 {
      margin: 0;
      font-size: 20px;
    }
  
    .sort-container {
      position: relative;
    }
  
    .sort-button {
      display: flex;
      align-items: center;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 8px 15px;
      cursor: pointer;
    }
  
    .arrow {
      width: 20px;
      height: 20px;
      margin-left: 5px;
      transition: transform 0.3s;
    }
  
    .arrow.rotated {
      transform: rotate(180deg);
    }
  
    .sort-dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 5px;
      width: 200px;
      z-index: 10;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  
    .sort-option {
      padding: 10px 15px;
      cursor: pointer;
    }
  
    .sort-option:hover {
      background-color: #f0f0f0;
    }
  
    .drinks-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
  
    .drink-card {
      background-color: #f5f5f5;
      border-radius: 10px;
      overflow: hidden;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
  
    .drink-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  
    .drink-image {
      width: 100px;
      height: 100px;
      margin-bottom: 15px;
    }
  
    .drink-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  
    .drink-info {
      width: 100%;
    }
  
    .drink-name {
      font-size: 16px;
      margin-bottom: 5px;
    }
  
    .drink-english-name {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
  
    .drink-price {
      font-size: 16px;
      font-weight: bold;
    }
  
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      width: 60px;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 100px;
      z-index: 10;
    }
  
    .sidebar-item {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      cursor: pointer;
      position: relative;
    }
  
    .sidebar-item svg {
      width: 24px;
      height: 24px;
    }
  
    .cart-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #FF5252;
      color: white;
      font-size: 12px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    /* Order panel styles */
    .order-panel {
  width: 350px;
  height: 100vh;
  background-color: white;
  position: fixed;
  right: 0;
  top: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 998; /* Lower z-index */
}
  

    .order-header {
      display: flex;
      align-items: center;
      padding: 20px;
      background-color: white;
      border-bottom: 1px solid #eee;
      position: sticky;
      top: 0;
      z-index: 10;
    }
  
    .back-button {
      background: #f5f5f5; /* สีพื้นหลัง */
    border: 1px solid #ddd; /* เส้นขอบ */
    border-radius: 5px; /* มุมโค้งมน */
    cursor: pointer;
    padding: 8px 12px; /* ระยะห่างภายใน */
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
  
    .back-button svg {
      width: 24px;
      height: 24px;
      fill: #333; /* สีของไอคอน */
    }
  
    .order-header h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      color: #333;
    }
  
    .order-list-header {
      display: flex;
      justify-content: space-between;
      padding: 15px 20px;
      background-color: #f8f8f8;
      border-bottom: 1px solid #eee;
      font-weight: 500;
      color: #666;
      position: sticky;
      top: 65px;
      z-index: 1;
    }
  
    .item-label {
      flex: 1;
    }
  
    .qty-label {
      width: 50px;
      text-align: center;
    }
  
    .order-items {
      flex: 1;
      overflow-y: auto;
      padding: 10px 0;
    }
  
    .order-item {
      padding: 15px 20px;
      border-bottom: 1px solid #f0f0f0;
      transition: all 0.3s ease;
    }
  
    .order-item:hover {
      background-color: #f9f9f9;
    }
  
    .item-info {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px;
    }
  
    .item-image {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      overflow: hidden;
      background-color: #f5f5f5;
    }
  
    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
    .item-details {
      flex: 1;
    }
  
    .item-name {
      font-size: 15px;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }
  
    .item-price {
      font-size: 14px;
      color: #795548;
      font-weight: 500;
    }
  
    .item-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
    }
  
    .quantity-control {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  
    .quantity-control input {
      width: 50px;
      padding: 5px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
  
    .remove-button {
      background: none;
      border: none;
      padding: 5px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
  
    .remove-button:hover {
      opacity: 1;
    }
  
    .order-footer {
      padding: 20px;
      background-color: white;
      border-top: 1px solid #eee;
      position: sticky;
      bottom: 0;
    }
  
    .total-section {
      margin-bottom: 15px;
    }
  
    .final-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }
  
    .total-label {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  
    .total-amount {
      font-size: 18px;
      font-weight: bold;
      color: #795548;
    }
  
    .payment-button {
      width: 100%;
      padding: 14px;
      background-color: #795548;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    .payment-button:hover {
      background-color: #5d4037;
    }
  
    @media (max-width: 768px) {
      .order-panel {
        width: 100%;
        height: calc(100vh - 60px);
        bottom: 60px;
        top: auto;
      }
      
      .order-header {
        padding: 15px;
      }
      
      .item-image {
        width: 45px;
        height: 45px;
      }
    }
  
    @media (max-width: 1024px) {
      .drinks-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  
    @media (max-width: 768px) {
      .auto-cafe {
        flex-direction: column
      }
      
      .main-content {
        width: 100% !important;
        padding-left: 20px;
        padding-bottom: 80px;
      }
      
      .sidebar {
        height: 60px;
        width: 100%;
        bottom: 0;
        top: auto;
        flex-direction: row;
        justify-content: space-around;
        padding-top: 0;
      }
      
      .order-panel {
        width: 100%;
        height: calc(100vh - 60px);
        bottom: 60px;
        top: auto
      }
    }


.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.summary-item:last-child {
  border-bottom: none;
}
.payment-panel {
  width: 380px;
  height: 100vh;
  background-color: #f5f5f5;
  position: fixed;
  right: 0;
  top: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
  z-index: 999; /* Higher z-index */
}
.payment-icons {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.payment-icon-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6;
  transform: scale(0.95);
}

.payment-icon-btn svg {
  width: 24px;
  height: 24px;
  color: #666;
  transition: all 0.3s ease;
}

.payment-icon-btn span {
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

/* Selected state */
.payment-icon-btn.selected {
  border-color: #795548;
  background-color: #fff5f2;
  opacity: 1;
  transform: scale(1);
  box-shadow: 0 4px 12px rgba(121, 85, 72, 0.15);
}

.payment-icon-btn.selected svg,
.payment-icon-btn.selected span {
  color: #795548;
}

/* Hover state */
.payment-icon-btn:hover {
  border-color: #795548;
  background-color: #fff5f2;
  opacity: 0.9;
  transform: scale(0.98);
}

.payment-icon-btn:hover svg,
.payment-icon-btn:hover span {
  color: #795548;
}

/* Unselected state */
.payment-icon-btn:not(.selected) {
  filter: grayscale(30%);
}
@media (max-width: 768px) {
    .payment-panel {
    width: 100%;
    height: calc(100vh - 60px);
    bottom: 60px;
    top: auto;
  }
  .order-panel {
    width: 100%;
    height: 50vh; /* เปลี่ยนขนาดเมื่อหน้าจอเล็กลง */
    bottom: 50vh;
  }
}
.card-info-form {
  margin-top: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #795548;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1.
}

@media (max-width: 768px) {
  .card-info-form {
    margin-top: 15px;
    padding: 15px;
  }
  
  .form-row {
    flex-direction: row;
  }
}
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 60px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  z-index: 10.
}

.sidebar-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  cursor: pointer;
  position: relative;
  color: #666;
  transition: all 0.3s ease;
}

.sidebar-item:hover {
  color: #795548;
}

.sidebar-item svg {
  width: 24px;
  height: 24px;
}

.sidebar-item .tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  margin-left: 10px;
}

.sidebar-item:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #795548;
  color: white;
  font-size: 12px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
}

@media (max-width: 768px) {
  .sidebar {
    height: 60px;
    width: 100%;
    bottom: 0;
    top: auto;
    flex-direction: row;
    justify-content: space-around;
    padding: 0;
  }

  .sidebar-item {
    margin: 0;
  }

  .sidebar-item .tooltip {
    display: none;
  }
}
.order-history-panel {
    width: 350px;
    height: 100vh;
    background-color: #f5f5f5;
    position: fixed;
    right: 0;
    top: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
}
@keyframes slideIn {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}

.history-content {
    padding: 20px;
    overflow-y: auto;
}

.empty-history {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}

@media (max-width: 768px) {
    .order-history-panel {
        width: 100%;
        height: calc(100vh - 60px);
        bottom: 60px;
        top: auto;
    }
}

.order-history {
    padding: 20px;
}

.order-history h3 {
    font-size: 18px;
    margin-bottom: 20px;
    color: #333;
}

.history-item {
    background: white;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.history-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.order-id {
    font-weight: bold;
    color: #795548;
}
.order-date {
    font-size: 12px;
    color: #666;
}

.history-item-detail {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    font-size: 14px;
    color: #333;
}

.history-footer {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    margin-top: 10px;
    border-top: 1px solid #eee;
}

.payment-method {
    font-size: 12px;
    color: #795548;
    padding: 4px 8px;
    background: #fff5f2;
    border-radius: 4px;
}
.promptpay-section {
    margin-top: 20px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    text-align: center;
}

.qr-container {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}

.qr-code {
    width: 200px;
    height: 200px;
    margin: 0 auto 15px;
    display: block;
}

.qr-info {
    text-align: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.promptpay-number {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
}

.total-amount {
    font-size: 18px;
    font-weight: bold;
    color: #795548;
}

.payment-instructions {
    text-align: left;
    margin-top: 20px;
    padding: 15px;
    background: #fff5f2;
    border-radius: 8px;
}

.payment-instructions h4 {
    color: #795548;
    margin-bottom: 10px;
}

.payment-instructions ol {
    padding-left: 20px;
    color: #666;
}

.payment-instructions li {
    margin-bottom: 8px;
}

@media (max-width: 768px) {
    .qr-code {
        width: 180px;
        height: 180px;
    }
}
.item-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
}

.quantity-control {
    display: flex;
    align-items: center;
    gap: 8px;
}

.quantity-btn {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 4px;
    background: #f0f0f0;
    color: #333;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quantity-btn:hover {
    background: #e0e0e0;
}

.quantity-control input {
    width: 40px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px;
}

.remove-button {
    background: none;
    border: none;
    padding: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.remove-button:hover {
    transform: scale(1.1);
}

.remove-button svg {
    width: 20px;
    height: 20px;
}
  </style>