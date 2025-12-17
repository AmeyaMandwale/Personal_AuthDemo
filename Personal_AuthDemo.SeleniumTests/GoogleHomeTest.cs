using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using Xunit;

public class GoogleHomeTest
{
    [Fact]
    public void GoogleHomePage_LoadsSuccessfully()
    {
        var options = new ChromeOptions();
        options.AddArgument("--headless=new");
        options.AddArgument("--no-sandbox");
        options.AddArgument("--disable-dev-shm-usage");

        using var driver = new ChromeDriver(options);

        driver.Navigate().GoToUrl("https://www.google.com");

        Assert.Contains("Google", driver.Title);
    }
}
