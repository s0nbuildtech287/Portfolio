import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

function localUploadPlugin() {
  return {
    name: "local-upload-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
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
                if (!fs.existsSync(targetDir)) {
                  fs.mkdirSync(targetDir, { recursive: true });
                }
                const safeName = Date.now() + "_" + fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
                const filePath = path.join(targetDir, safeName);

                const base64Data = base64Content.replace(/^data:image\/\w+;base64,/, "");
                const buffer = Buffer.from(base64Data, "base64");
                fs.writeFileSync(filePath, buffer);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, url: `/images/projects/${safeName}` }));
                return;
              } else if (type === "readme") {
                const targetDir = path.resolve(__dirname, "readmee");
                if (!fs.existsSync(targetDir)) {
                  fs.mkdirSync(targetDir, { recursive: true });
                }
                const safeName = Date.now() + "_" + fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
                const filePath = path.join(targetDir, safeName);

                fs.writeFileSync(filePath, textContent, "utf-8");

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
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localUploadPlugin()],
  server: {
    port: 3000
  }
});
