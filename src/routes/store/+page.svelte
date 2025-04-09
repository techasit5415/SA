<script lang="ts">
    import { orderHistory } from '$lib/stores';
    // ...existing code...

    function handlePaymentConfirm() {
        // Create new order record
        const newOrder = {
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            items: [...orderItems],
            total: total,
            date: new Date(),
            paymentMethod: selectedPaymentMethod
        };
        
        // Add to order history store
        orderHistory.update(history => [...history, newOrder]);
        
        // Clear current order and reset
        orderItems = [];
        showPaymentPanel = false;
        showOrderPanel = true;
        selectedPaymentMethod = 'credit-card';
    }
</script>