import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = ({ accessToken }) => {
  const [fetchResponse, setFetchResponse] = useState(null);
  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [activityResponse, setActivityResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      console.warn("⚠️ No access token provided via props.");
      return;
    }

    // 1️⃣ Fetch Pull Requests
    const fetchPRs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://api.github.com/repos/AmeyaMandwale/auth_demo/pulls",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setFetchResponse(res.data);
        console.log("📦 Pull Requests:", res.data);

        if (res.data.length > 0) {
          const pr = res.data[0];

          // Fetch PR files
          const filesRes = await axios.get(pr.url + "/files", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const files = filesRes.data;
          generateGeminiReview(pr, files); // no need to pass accessToken separately
        } else {
          setAnalysisResponse({ summary: "No PRs available for analysis." });
        }
      } catch (err) {
        console.error("❌ Error fetching PRs:", err);
        setAnalysisResponse({ summary: "Failed to fetch PRs." });
      } finally {
        setLoading(false);
      }
    };

    // 2️⃣ Fetch Recent User Activity
    const fetchActivity = async () => {
      try {
        const res = await axios.get(
          "https://api.github.com/users/AmeyaMandwale/events",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setActivityResponse(res.data.slice(0, 5));
      } catch (err) {
        console.error("❌ Error fetching activity:", err);
      }
    };

    fetchPRs();
    fetchActivity();
  }, [accessToken]); // ✅ dependency is accessToken prop

 // 3️⃣ Gemini Review Generation + Post to GitHub
const generateGeminiReview = async (pr, files = []) => {
  try {
    const codeText = files.length
      ? files
          .map(f => `File: ${f.filename}\n${f.patch || f.contents || ""}`)
          .join("\n\n")
      : "No code changes available for review.";

    const prompt = `
You are an expert AI code reviewer.
Analyze the following code changes from the pull request titled "${pr.title}" (branch: ${pr.head.ref} → ${pr.base.ref}).

Code changes:
${codeText}

Provide a response of up to 350 words including:
1️⃣ Summary of the code changes
2️⃣ Major Suggestions
3️⃣ Key Changes Required
    `;

    // 🔹 Call Gemini API
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=AIzaSyBaEdh8gGQ-jhUWz_l6NLM4YCE_M4AeEuI",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No meaningful response received.";

    // 🔹 Update analysis summary immediately
    setAnalysisResponse({ summary: text, status: "AI review generated successfully." });

    // 🔹 Post AI review to GitHub
   // Inside generateGeminiReview in Dashboard.js
try {
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No meaningful response received.";

  setAnalysisResponse({ summary: text });

  // 🔹 Post AI review to GitHub
  const backendRes = await axios.post(
    "http://localhost:4000/github/postReview", // make sure backend is running
    {
      repoOwner: "AmeyaMandwale",
      repoName: "auth_demo",
      prNumber: pr.number,
      geminiResponse: {
        summary: text,
        keyChanges: "Automatically analyzed by Gemini AI.",
        suggestions: "Review suggestions are included in the summary.",
      },
      accessToken, // use accessToken from App.js prop
    }
  );

  if (backendRes.data?.success) {
    console.log("✅ Gemini AI review posted successfully:", backendRes.data.commentUrl);
  } else {
    console.warn("⚠️ Gemini AI review posting returned unexpected response:", backendRes.data);
  }
} catch (err) {
  // 🔹 Properly handle error
  console.error("❌ Error posting Gemini review:", err.response?.data || err.message);
  setAnalysisResponse((prev) => ({
    summary: prev?.summary + "\n\n⚠️ Failed to post AI review to GitHub.",
  }));
}

  } catch (err) {
    console.error("❌ Error generating Gemini review:", err);
    setAnalysisResponse({ summary: "Error generating AI review.", status: "❌ Generation failed." });
  }
};


  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>GitHub Data Dashboard</h2>

      {/* Pull Requests */}
      <section>
        <h3>1️⃣ Pull Requests</h3>
        {fetchResponse && fetchResponse.length > 0 ? (
          fetchResponse.map((pr) => (
            <div key={pr.id} style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "10px", marginBottom: "10px" }}>
              <p><strong>Title:</strong> {pr.title}</p>
              <p><strong>Branch:</strong> {pr.head.ref} → {pr.base.ref}</p>
              <p><a href={pr.html_url} target="_blank" rel="noopener noreferrer">View PR</a></p>
            </div>
          ))
        ) : (
          <p>No pull requests found.</p>
        )}
      </section>

      {/* Gemini AI Summary */}
      <section>
        <h3>2️⃣ Gemini AI Summary</h3>
        {loading ? (
          <p>Analyzing PR with Gemini...</p>
        ) : (
          <p style={{ whiteSpace: "pre-wrap" }}>
            {analysisResponse?.summary || "No summary available"}
          </p>
        )}
      </section>

      {/* Recent GitHub Activity */}
      <section>
        <h3>3️⃣ Recent GitHub Activity</h3>
        {activityResponse && activityResponse.length > 0 ? (
          activityResponse.map((event) => (
            <div key={event.id} style={{ border: "1px solid #eee", padding: "8px", borderRadius: "8px", marginBottom: "8px" }}>
              <p><strong>Type:</strong> {event.type}</p>
              <p><strong>Repo:</strong> {event.repo.name}</p>
              <p><strong>Date:</strong> {new Date(event.created_at).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No recent activity found.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
