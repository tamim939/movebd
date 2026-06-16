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
    try {
      const { chat_id, title, links } = req.body;

      console.log("-----------------------------------------");
      console.log("API: /api/send-vbox called");
      console.log("Payload:", { chat_id, title, linksCount: links?.length });

      if (!chat_id || !links) {
        console.warn("send-vbox: Missing chat_id or links");
        return res.status(400).json({ 
          ok: false, 
          error: "Missing chat_id or links. Please ensure you are viewing through the Telegram Bot." 
        });
      }

      const linksText = links.map((l: any) => `<b>🎬 ${l.label}:</b> ${l.url}`).join("\n\n");
      const message = `<b>✅ Successful!</b>\n\nYour video <b>${title}</b> has been unlocked.\n\n${linksText}\n\nEnjoy watching!`;

      console.log(`Sending message via TG Bot to chat: ${chat_id}`);
      
      const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: String(chat_id),
          text: message,
          parse_mode: "HTML",
        }),
      });

      const data: any = await tgResponse.json();
      console.log("Telegram response received:", data);

      if (!tgResponse.ok || !data.ok) {
        console.error("Telegram API reported error:", data);
        return res.status(tgResponse.status || 500).json({ 
          ok: false, 
          error: data.description || "Telegram API error",
          details: data
        });
      }

      return res.json({ ok: true, data });
    } catch (error: any) {
      console.error("CRITICAL error in /api/send-vbox:", error);
      return res.status(500).json({ 
        ok: false, 
        error: error.message || "Internal Server Error" 
      });
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
