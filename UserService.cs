public interface IUserOperations
{
    void CreateUser(string name);
    void DeleteUser(int id);
    void SendEmail(string email, string message);
    void GenerateReport(int userId);
    void ProcessPayment(int userId, decimal amount);
}

public class UserService : IUserOperations
{
    public void CreateUser(string name)
    {
        Console.WriteLine("User created: " + name);
    }

    public void DeleteUser(int id)
    {
        Console.WriteLine("User deleted: " + id);
    }

    public void SendEmail(string email, string message)
    {
        // This class should NOT be sending emails → ISP violation
        Console.WriteLine("Email sent");
    }

    public void GenerateReport(int userId)
    {
        // This class should NOT be generating reports → ISP violation
        Console.WriteLine("Report generated");
    }

    public void ProcessPayment(int userId, decimal amount)
    {
        // This class should NOT process payments → ISP violation
        Console.WriteLine("Payment processed");
    }
}
