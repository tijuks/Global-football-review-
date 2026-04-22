
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // API routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/feedback", express.json(), (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log("Feedback received:", { name, email, subject, message });
    // In a real app, you would send an email here using a service like Resend
    res.json({ status: "success", message: "Feedback received" });
  });

  app.get("/api/team-logo", async (req, res) => {
    const teamName = req.query.teamName as string;
    if (!teamName) {
      return res.status(400).json({ error: "teamName is required" });
    }
    try {
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`TheSportsDB returned status ${response.status}. Response: ${errorText}. Treating as logo not found.`);
        return res.json({ logo: null });
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON from TheSportsDB:", text);
        return res.status(500).json({ error: "Invalid JSON from provider" });
      }

      if (data.teams && data.teams.length > 0) {
        return res.json({ logo: data.teams[0].strBadge || null });
      }
      res.json({ logo: null });
    } catch (error) {
      console.error("Error fetching team logo:", error);
      res.status(500).json({ error: "Failed to fetch logo" });
    }
  });

  // Socket.io logic
  const messages: any[] = [];
  const users = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send initial state
    socket.emit("init", { messages });

    socket.on("join", (user) => {
      users.set(socket.id, user);
      io.emit("user:joined", { user, count: users.size });
    });

    socket.on("message:send", (msg) => {
      const message = {
        id: Date.now().toString(),
        text: msg.text,
        user: msg.user,
        timestamp: Date.now()
      };
      messages.push(message);
      if (messages.length > 50) messages.shift(); // Keep last 50
      io.emit("message:received", message);
    });

    socket.on("disconnect", () => {
      const user = users.get(socket.id);
      users.delete(socket.id);
      if (user) {
        io.emit("user:left", { user, count: users.size });
      }
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
