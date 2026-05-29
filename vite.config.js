import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    {
      name: 'serve-admin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Serve /admin and /admin/ from public/admin/index.html
          if (req.url === '/admin' || req.url === '/admin/' || req.url.startsWith('/admin/?')) {
            const adminPath = path.resolve(__dirname, 'public/admin/index.html');
            if (fs.existsSync(adminPath)) {
              res.setHeader('Content-Type', 'text/html');
              res.end(fs.readFileSync(adminPath, 'utf-8'));
              return;
            }
          }
          next();
        });
      }
    }
  ]
});
