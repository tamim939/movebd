import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Telegram Bot Token (from user request)
  const BOT_TOKEN = "8689967601:AAHNoB6lyfcl1bHr08fLLpDg5oRu-XYFQyw";

  // API to send message to user via Bot
  app.post("/api/send-vbox", async (req, res) => {
    const { chat_id, title, links } = req.body;

    if (!chat_id || !links) {
      return res.status(400).json({ error: "Missing chat_id or links" });
    }

    const linksText = links.map((l: any) => `🎬 ${l.label}: ${l.url}`).join("\n\n");
    const message = `✅ *Successful!*\n\nYour video *${title}* has been unlocked.\n\n${linksText}\n\nEnjoy watching!`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error sending TG message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Basic health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
