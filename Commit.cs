 public async Task<DateTime> GetLastCommitTimeAsync(
        HttpClient http,
        string owner,
        string repo,
        int prNumber)
    {
        string url = $"https://api.github.com/repos/{owner}/{repo}/pulls/{prNumber}/commits";

        var json = await http.GetStringAsync(url);
        var commits = JsonSerializer.Deserialize<List<GitHubCommitDto>>(json);

        return commits?
            .Select(c => c.commit.author.date)
            .Max() ?? DateTime.UtcNow;
    }
