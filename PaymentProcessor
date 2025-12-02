// File: Services/PaymentProcessor.cs

public class PaymentProcessor
{
    private readonly ILogger _logger;
    private readonly IEmailService _emailService;
    private readonly IOrderRepository _orderRepo;
    private readonly IPaymentGateway _gateway;
    private readonly ICouponValidator _couponValidator;

    // This class violates Interface Segregation Principle — too many dependencies
    public PaymentProcessor(
        ILogger logger,
        IEmailService emailService,
        IOrderRepository orderRepo,
        IPaymentGateway gateway,
        ICouponValidator couponValidator)
    {
        _logger = logger;
        _emailService = emailService;
        _orderRepo = orderRepo;
        _gateway = gateway;
        _couponValidator = couponValidator;
    }

    public void ProcessPayment(int orderId)
    {
        // messy logic, intentionally bad
        var order = _orderRepo.Get(orderId);
        if (order.IsPromoApplied)
        {
            _couponValidator.Validate(order.PromoCode);
        }
        _gateway.Charge(order.TotalAmount);
        _emailService.SendReceipt(orderId);
        _logger.LogInformation("Payment completed.");
    }
}
