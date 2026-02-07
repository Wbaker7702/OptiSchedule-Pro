<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1t9N6qD-bsuD6OLWG_mKSU2RdZlj1jyCD

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` (or `.env`) for the local proxy server.
   - Optional: set `SENTINEL_ALLOWED_ORIGINS` (comma-separated) to control CORS.
   - Optional: set `SENTINEL_API_PORT` to change the proxy port (default: 3001).
3. If your API server is on a different origin, set `VITE_SENTINEL_API_URL` in `.env.local`.
   Example: `VITE_SENTINEL_API_URL=http://localhost:3001/api/sentinel`
   (Never put secrets in `VITE_` variables; they are exposed to the browser.)
4. Start the local proxy in a second terminal:
   `npm run ai-proxy`
5. Run the app:
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key (this is read by the local API server, not bundled into the browser).
3. Run the app (web + API):
   `npm run dev`

The Gemini API key stays server-side in the proxy process and is never embedded in the client bundle.
