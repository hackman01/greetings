# Greetify — Documentation

## Problem-Solving Approach: Image Overlay Logic

The core feature of Greetify is compositing a user's profile photo and name onto a template background in real time, producing a downloadable greeting card. The implementation uses the HTML Canvas API within a React component (`FreeModal.jsx`).

### Flow

1. **User selects a template** — The `TemplateCard` displays available backgrounds. Clicking a free template opens `FreeModal`.
2. **Canvas composition** — A hidden `<canvas>` element is used as an off-screen render target.
3. **Image loading** — Both the template background and the user's profile photo are loaded via `new Image()` with `crossOrigin = "anonymous"` to avoid CORS issues. Each load is wrapped in a Promise.
4. **Background placement** — The template image is drawn first, filling the full canvas dimensions (`ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)`).
5. **User photo as circular overlay** — The user photo is clipped into a circle using `ctx.arc()` + `ctx.clip()`, then drawn in the top-right corner. A white border ring is added by drawing a filled circle slightly larger than the clip region behind the photo.
6. **Name rendering** — The user's name is drawn to the left of the photo using `ctx.fillText()` with a text shadow for readability against varied backgrounds.
7. **Preview generation** — The composited canvas is exported to a data URL via `canvas.toDataURL('image/png')` and displayed in the modal.
8. **Sharing/download** — The user can share the generated image via the Web Share API (with `navigator.share`) or download it as `greeting.png`.

### Key design decisions

- **Canvas over DOM composition**: Rendering to canvas produces a single rasterized image, making download/share straightforward without needing server-side processing.

### Code location

- Image composition logic: `src/components/FreeModal.jsx:32-88`
- Photo upload handling: `src/context/AuthContext.jsx:69-81`
- Server-side photo storage: `server/routes/auth.js:254-278`

---

## Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| UI library | Material UI (MUI) 9 |
| CSS framework | Tailwind CSS 4 |
| HTTP client | Axios |
| Authentication | @react-oauth/google |
| Icons | Material Icons |
| HTTPS dev certs | vite-plugin-mkcert |

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES modules) |
| Framework | Express 5 |
| Database | MongoDB via Mongoose 9 |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| File uploads | Multer 2 |
| OAuth | google-auth-library |
| Environment | dotenv |

### DevOps / Tooling

| Tool | Purpose |
|---|---|
| Nodemon | Server auto-restart in development |
| Concurrently | Run client and server in parallel |
| ESLint | Code linting |
| Postman | API testing (external) |

### Infrastructure

- **Vite proxy**: Routes `/api` and `/uploads` requests from the frontend dev server to the Express backend, avoiding CORS issues in development.
- **Static file serving**: Uploaded user photos are served from `server/uploads/` via `express.static`.
- **JWT auth flow**: Token-based authentication stored in `localStorage`, sent via `Authorization: Bearer` header.

---

## Challenges & Solutions

### Canvas — Image preview and template compositing

The greeting card preview is rendered on a hidden `<canvas>` element. The template background image is drawn first, then the user's photo is clipped into a circular overlay using `ctx.arc()` + `ctx.clip()`, with a white border ring for visual separation. The user's name is rendered alongside using `ctx.fillText()`. The final composited result is exported to a data URL. Since the canvas needs to physically exist in the DOM to render, a `<canvas ref={canvasRef}>` element is included in the component tree (visually hidden via `display: none`).

### Share — Web Share API compatibility

The Web Share API (`navigator.share`) is the standard way to trigger the native share sheet on mobile, but it is **not** a React Native API — it is a browser API that only works in **secure contexts** (HTTPS or localhost). During development on a Linux machine, accessing the app via the device's LAN IP (e.g., `192.168.x.x:5173`) was neither localhost nor HTTPS, so `navigator.share` was unavailable. The solution was to add `vite-plugin-mkcert`, which generates a trusted local HTTPS certificate. This made both `https://localhost:5173` and `https://<lan-ip>:5173` work as secure contexts, enabling the share feature on mobile browsers connected to the same network.

### OAuth — Google profile picture rate limiting (429)

After a successful Google OAuth login, the user's profile photo URL (from Google's CDN) is stored as `photoUrl`. Refreshing the page frequently caused Google to return **429 Too Many Requests** for that image URL, breaking the avatar display. The fix was twofold: (1) MUI's Avatar component natively falls back to showing the user's initials when the image fails to load; (2) an `onError` handler was added to the `<img>` element inside the Avatar to catch the failure, display a user-facing error message, and reset the error state on dismiss so the image retries on the next render.

### Backend HTTPS — Mixed content warnings

The frontend dev server runs on HTTPS (via mkcert) while the Express backend runs on plain HTTP. This caused **Mixed Content** warnings — the browser blocked HTTP requests originating from an HTTPS page. Initially, SSL certificates were installed on the Express server to make it HTTPS too, but self-signed certs caused browser trust issues. The final solution was to configure **Vite's dev proxy** in `vite.config.js` to forward `/api` and `/uploads` requests from the Vite dev server to the backend (`http://localhost:4000`). This eliminated mixed-content issues entirely because the browser only sees HTTPS connections to the Vite dev server.

> **Note**: Google's CDN sometimes still responds with 429 when the profile picture URL is requested too many times. The error auto-recovers after a cooldown period, and the Avatar's `onError` + state reset mechanism ensures the image is retried automatically.

---

## Future Improvements

### Scalability

- **Cloud storage for uploads**: Replace local `server/uploads/` directory with S3/GCS/Azure Blob. This prevents disk space exhaustion in production and enables CDN delivery for faster image loading across regions.
- **CDN for templates**: Serve template images from a CDN with cache headers and image optimization pipelines (WebP auto-conversion, responsive sizing via srcset).
- **Database indexing**: Add indexes on `User.email` and `User.authProvider` for faster lookups as user count grows.g.

### Performance

- **Canvas worker**: Offload the image compositing to a Web Worker to prevent UI blocking during generation.

### Feature & UX

- **Admin dashboard**: Add an admin role to manage subscriptions, template images, discounts, and categories from a dedicated interface.

