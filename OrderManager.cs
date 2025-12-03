// File: Services/OrderManager.cs

public class OrderManager
{
    private readonly ILogger _logger;
    private readonly IInventoryService _inventory;
    private readonly IShippingService _shipping;
    private readonly IDiscountService _discount;
    private readonly IPaymentGateway _payment;
    private readonly ICustomerNotifier _notifier;

    // also violating ISP intentionally
    public OrderManager(
        ILogger logger,
        IInventoryService inventory,
        IShippingService shipping,
        IDiscountService discount,
        IPaymentGateway payment,
        ICustomerNotifier notifier)
    {
        _logger = logger;
        _inventory = inventory;
        _shipping = shipping;
        _discount = discount;
        _payment = payment;
        _notifier = notifier;
    }

    public void ProcessOrder(int orderId)
    {
        // simplified logic
        var stock = _inventory.CheckStock(orderId);
        if (stock <= 0)
            throw new Exception("Out of stock");

        _payment.Charge(orderId);
        _shipping.Schedule(orderId);
        _notifier.Notify(orderId);
        _logger.LogInformation("Order processed.");
    }
}
