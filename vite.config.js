import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function syncStaticAssetsPlugin() {
  return {
    name: "sync-static-assets",
    buildStart() {
      try {
        copyRecursiveSync(path.resolve(__dirname, "images"), path.resolve(__dirname, "public/images"));
        copyRecursiveSync(path.resolve(__dirname, "readmee"), path.resolve(__dirname, "public/readmee"));
        copyRecursiveSync(path.resolve(__dirname, "data"), path.resolve(__dirname, "public/data"));
        console.log("✓ Synchronized static assets (images, readmee, data) into public/");
      } catch (err) {
        console.error("Error syncing static assets:", err);
      }
    }
  };
}

function localUploadPlugin() {
  return {
    name: "local-upload-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const dataFilePath = path.resolve(__dirname, "data/projects.json");
        const publicDataFilePath = path.resolve(__dirname, "public/data/projects.json");

        // GET /api/projects: Đọc danh sách dự án từ file JSON ổ cứng
        if (req.method === "GET" && req.url === "/api/projects") {
          try {
            let targetPath = dataFilePath;
            if (!fs.existsSync(targetPath) && fs.existsSync(publicDataFilePath)) {
              targetPath = publicDataFilePath;
            }
            if (fs.existsSync(targetPath)) {
              const fileData = fs.readFileSync(targetPath, "utf-8");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(fileData);
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify([]));
            }
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // POST /api/projects: Ghi đồng bộ cả 2 nơi (data/projects.json và public/data/projects.json)
        if (req.method === "POST" && req.url === "/api/projects") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const dataDir = path.resolve(__dirname, "data");
              const publicDataDir = path.resolve(__dirname, "public/data");
              if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
              if (!fs.existsSync(publicDataDir)) fs.mkdirSync(publicDataDir, { recursive: true });

              fs.writeFileSync(dataFilePath, body, "utf-8");
              fs.writeFileSync(publicDataFilePath, body, "utf-8");

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        // POST /api/upload: Upload ảnh & file README đồng bộ vào public/
        if (req.method === "POST" && req.url === "/api/upload") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              const data = JSON.parse(body);
              const { type, fileName, base64Content, textContent } = data;

              if (type === "image") {
                const targetDir = path.resolve(__dirname, "images/projects");
                const publicTargetDir = path.resolve(__dirname, "public/images/projects");

                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
                if (!fs.existsSync(publicTargetDir)) fs.mkdirSync(publicTargetDir, { recursive: true });

                const safeName = Date.now() + "_" + fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
                const filePath = path.join(targetDir, safeName);
                const publicFilePath = path.join(publicTargetDir, safeName);

                const base64Data = base64Content.replace(/^data:image\/\w+;base64,/, "");
                const buffer = Buffer.from(base64Data, "base64");

                fs.writeFileSync(filePath, buffer);
                fs.writeFileSync(publicFilePath, buffer);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, url: `/images/projects/${safeName}` }));
                return;
              } else if (type === "readme") {
                const targetDir = path.resolve(__dirname, "readmee");
                const publicTargetDir = path.resolve(__dirname, "public/readmee");

                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
                if (!fs.existsSync(publicTargetDir)) fs.mkdirSync(publicTargetDir, { recursive: true });

                const safeName = Date.now() + "_" + fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
                const filePath = path.join(targetDir, safeName);
                const publicFilePath = path.join(publicTargetDir, safeName);

                fs.writeFileSync(filePath, textContent, "utf-8");
                fs.writeFileSync(publicFilePath, textContent, "utf-8");

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: true,
                    url: `/readmee/${safeName}`,
                    fileName: safeName,
                    content: textContent
                  })
                );
                return;
              }
            } catch (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, error: err.message }));
              return;
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), syncStaticAssetsPlugin(), localUploadPlugin()],
  server: {
    port: 3000
  }
});
