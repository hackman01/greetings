# Greetify

Personalized greeting card generator — compose user photos and names onto template backgrounds and share them.

## Prerequisites

- **Node.js** >= 18
- **MongoDB** running locally (default: `mongodb://localhost:27017`)
- **Google OAuth credentials** (for Google sign-in)

## Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd greetings

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

Edit `.env` with your values:

| Variable | Description |
|---|---|
| `PORT` | Backend port (default: 4000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | OAuth redirect URI (default: `https://localhost:5173`) |
| `VITE_GOOGLE_CLIENT_ID` | Same as `GOOGLE_CLIENT_ID` (exposed to frontend) |

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project or select an existing one
3. Enable the **Google+ API** / **OAuth consent screen**
4. Under **Credentials**, create an **OAuth 2.0 Client ID** (Web application)
5. Add `https://localhost:5173` to **Authorized JavaScript origins**
6. Add `https://localhost:5173` to **Authorized redirect URIs**
7. Copy the Client ID and Client Secret into `.env`

## Run

### Development (client + server concurrently)

```bash
npm run dev
```

This starts:
- **Client**: Vite dev server at `https://localhost:5173`
- **Server**: Express API at `http://localhost:4000`

### Run separately

```bash
npm run dev:server   # Backend on port 4000
npm run dev:client   # Frontend on port 5173
```

### Production build

```bash
npm run build        # Builds the frontend to dist/
npm run server       # Starts the Express server (serves backend only)
```

## How it works

- **Vite proxy** forwards `/api` and `/uploads` requests from the frontend to the Express backend, avoiding mixed-content issues when the frontend runs on HTTPS.
- **HTTPS on localhost** is provided by `vite-plugin-mkcert`, which generates a trusted local TLS certificate. This enables the Web Share API for testing on mobile devices over LAN.
- **Authentication** supports Email/Password, Google OAuth, and Guest login. JWTs are stored in `localStorage`.
- **Photo uploads** are handled by Multer and saved to `server/uploads/`, served via `express.static`.
- **Greeting card generation** uses the HTML Canvas API to composite the user's photo (as a circular overlay) and name onto a template background.

## Access on mobile

Once the dev server is running, find your LAN IP:

```bash
ip a | grep inet
```

Open `https://<your-lan-ip>:5173` on your mobile browser (same network). The mkcert certificate makes the connection secure, enabling the Web Share API for native sharing.

> **Note:** The Web Share API (`navigator.share`) only works on **mobile browsers** — it is not supported on desktop. To test Google OAuth login on a mobile browser, use **ngrok** to expose your localhost:
>
> 1. `ngrok https 5173`
> 2. Copy the generated `https://<ngrok-url>.ngrok-free.app` URL
> 3. Add it to **Authorized JavaScript origins** and **Authorized redirect URIs** in [Google Cloud Console](https://console.cloud.google.com)
> 4. Set `GOOGLE_REDIRECT_URI` in `.env` to the same ngrok URL
> 5. Restart the dev server
> 6. Use the link provided by ngrok to access in mobile browser.
