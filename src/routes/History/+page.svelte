<script lang="ts">
    import { goto } from '$app/navigation';
    import { orderHistory } from '$lib/stores';
    
    let selectedOrder = null;
    let timer = null;
    let remainingTime = 0;
    
    function goBack() {
        goto('Menu');
    }

    function viewOrderDetails(order) {
        selectedOrder = order;
        // Calculate total drinks
        const totalDrinks = order.items.reduce((sum, item) => sum + item.quantity, 0);
        // Set timer for 60 seconds per drink
        remainingTime = totalDrinks * 60;
        startTimer();
    }

    function startTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
            } else {
                clearInterval(timer);
            }
        }, 1000);
    }

    function getRemainingTime(order) {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - order.startTime) / 1000);
        const remainingSeconds = Math.max(0, order.duration - elapsedSeconds);
        return remainingSeconds;
    }

    function formatTime(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // อัพเดทเวลาทุกวินาที
    setInterval(() => {
        if (selectedOrder) {
            remainingTime = getRemainingTime(selectedOrder);
        }
    }, 1000);

    function closeOrderDetails() {
        selectedOrder = null;
        if (timer) clearInterval(timer);
    }
</script>

<!-- Add modal for order details -->
{#if selectedOrder}
    <div class="modal-overlay" on:click={closeOrderDetails}>
        <div class="modal-content" on:click|stopPropagation>
            <div class="modal-header">
                <h2>Order Details</h2>
                <button class="close-button" on:click={closeOrderDetails}>×</button>
            </div>
            <div class="modal-body">
                <div class="order-info">
                    <span class="order-number">Order #{selectedOrder.id}</span>
                    <span class="order-date">{new Date(selectedOrder.date).toLocaleString()}</span>
                </div>
                <!-- Add timer display -->
                <div class="preparation-time">
                    <span class="timer-label">Preparation Time:</span>
                    <span class="timer {remainingTime === 0 ? 'completed' : ''}">
                        {remainingTime === 0 ? 'Ready!' : formatTime(remainingTime)}
                    </span>
                </div>
                <div class="order-items">
                    {#each selectedOrder.items as item}
                        <div class="order-item">
                            <div class="item-info">
                                <span class="item-name">{item.englishName}</span>
                                <span class="item-quantity">×{item.quantity}</span>
                            </div>
                            <span class="item-price">฿{item.price * item.quantity}</span>
                        </div>
                    {/each}
                </div>
                <div class="order-summary">
                    <div class="payment-info">
                        <span>Payment Method</span>
                        <span class="payment-method">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div class="total-info">
                        <span>Total Amount</span>
                        <span class="total">฿{selectedOrder.total}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<div class="history-page">
    <div class="history-header">
        <button class="back-button" on:click={goBack}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#333"/>
            </svg>
        </button>
        <h1>Order History</h1>
    </div>

    <div class="history-content">
        {#if $orderHistory.length > 0}
            {#each $orderHistory as order}
                <div class="history-item" on:click={() => viewOrderDetails(order)}>
                    <div class="history-header">
                        <span class="order-id">#{order.id}</span>
                        <span class="order-date">
                            {new Date(order.date).toLocaleString()}
                        </span>
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
                    <div class="view-details">Click to view details</div>
                </div>
            {/each}
        {:else}
            <div class="empty-history">
                <p>No order history yet</p>
                <button class="back-home" on:click={goBack}>Back to Menu</button>
            </div>
        {/if}
    </div>
</div>

<style>
  .history-page {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
  }

  .history-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
  }

  .back-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
      margin-right: 15px;
  }

  .back-button svg {
      width: 24px;
      height: 24px;
  }

  h1 {
      margin: 0;
      font-size: 24px;
      color: #333;
  }

  .history-item {
      background: white;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
  }

  .history-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .history-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
  }

  .order-id {
      font-weight: bold;
      color: #795548;
      font-size: 16px;
  }

  .order-date {
      color: #666;
      font-size: 14px;
  }

  .history-item-detail {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 15px;
      color: #333;
  }

  .history-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #eee;
  }

  .payment-method {
      font-size: 14px;
      color: #795548;
      padding: 6px 12px;
      background: #fff5f2;
      border-radius: 6px;
  }

  .total {
      font-size: 16px;
      font-weight: bold;
      color: #333;
  }

  .view-details {
      text-align: center;
      color: #795548;
      font-size: 12px;
      margin-top: 10px;
      opacity: 0.7;
  }

  .empty-history {
      text-align: center;
      padding: 40px 20px;
      color: #666;
  }

  .back-home {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #795548;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
  }

  .back-home:hover {
      background-color: #5d4037;
  }

  .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
  }

  .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
  }

  .modal-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .close-button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
  }

  .modal-body {
      padding: 20px;
  }

  .order-info {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
  }

  .order-number {
      font-weight: bold;
      color: #795548;
      margin-right: 15px;
  }

  .order-items {
      margin-bottom: 20px;
  }

  .order-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
  }

  .item-info {
      display: flex;
      gap: 10px;
  }

  .item-quantity {
      color: #666;
  }

  .order-summary {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
  }

  .payment-info, .total-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
  }

  .preparation-time {
      background: #fff5f2;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .timer-label {
      color: #795548;
      font-weight: 500;
  }

  .timer {
      font-family: monospace;
      font-size: 18px;
      font-weight: bold;
      color: #795548;
      background: white;
      padding: 5px 10px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
  }

  .timer.completed {
      background: #4CAF50;
      color: white;
  }

  @media (max-width: 768px) {
      .history-page {
          padding: 15px;
      }

      .modal-content {
          width: 95%;
          margin: 10px;
      }
  }
</style>