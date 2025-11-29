public async Task<bool> AddCommentAsync(string owner, string repo, string externalId, string comment)
    {
        var integration = await _ctx.Integrations
            .FirstOrDefaultAsync(i => i.Provider == "github");

        if (integration == null)
            throw new Exception("❌ GitHub Integration not found");

        var token = ExtractToken(integration.Config);

        var http = _factory.CreateClient();
        http.DefaultRequestHeaders.UserAgent.ParseAdd("App");
        //http.DefaultRequestHeaders.Authorization =
          //  new AuthenticationHeaderValue("Bearer", token);
          // 🔥 Use BOT token instead of user token
var botToken = Environment.GetEnvironmentVariable("GITHUB_BOT_TOKEN")
              ?? _config["GITHUB_BOT_TOKEN"];

if (string.IsNullOrEmpty(botToken))
    throw new Exception("❌ GITHUB_BOT_TOKEN not found in env or appsettings!");

http.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", botToken);


        // Convert GitHub internal ID → PR number
        var prNumber = await _prFileService.GetPRNumberFromExternalId(http, owner, repo, externalId);
        if (prNumber == null)
            throw new Exception("❌ Could not resolve PR number for comment.");

        string url = $"https://api.github.com/repos/{owner}/{repo}/issues/{prNumber}/comments";

        var payload = new { body = comment };
      

        return res.IsSuccessStatusCode;
    }
    
