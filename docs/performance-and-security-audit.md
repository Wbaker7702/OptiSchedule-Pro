# Performance and Security Audit

## Main performance bottlenecks identified

1. **Eager route loading in `App.tsx`**
   - Every page, chart, icon set, and AI integration was bundled up front.
   - Optimized with `React.lazy` and `Suspense` so inactive pages load on demand.

2. **Sentinel AI streaming state churn**
   - The chat widget updated React state for every model stream chunk.
   - Optimized by buffering streamed text and flushing updates on animation
     frames, reducing render commits during long responses.

3. **Repeated derived counts during render**
   - Operations and inventory counts were recomputed with multiple `filter`
     passes on every render.
   - Optimized with memoized single-pass reductions.

4. **Unstable render-time objects and callbacks**
   - Sidebar navigation sections and several App callbacks were recreated every
     render.
   - Optimized by hoisting static navigation data and stabilizing callbacks with
     `useCallback`.

5. **Unstable list keys**
   - Sentinel AI messages, procurement logs, and metrics rows used array
     indexes as keys.
   - Optimized with stable message/log IDs and department keys.

## Security bottlenecks identified

1. **Unprefixed Gemini secret injection**
   - `vite.config.ts` exposed `GEMINI_API_KEY` through `process.env` defines.
   - Replaced with explicit `VITE_GEMINI_API_KEY` demo configuration and a
     centralized Gemini client helper.

2. **Sentinel AI policy as an implicit prompt-only control**
   - The model prompt had a narrow instruction not to reveal logic.
   - Expanded the Sentinel policy, documented its limitations, and clarified
     that production model calls should go through a server-side gateway.

3. **Unnecessary import-map CDN surface**
   - `index.html` included an import map for packages already bundled by Vite.
   - Removed the import map and added a restrictive CSP for current endpoints.
