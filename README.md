
# RCC Infrastructure

A full-stack construction company website built with React, Vite, React Router, Express, and MongoDB.

## Features

- Responsive homepage and dedicated inner pages
- About Us, Services, Projects, Expertise, Our Process, and Contact pages
- Individual service and project detail pages
- Reusable components for navigation, footer, cards, buttons, and headings
- Searchable services and filterable projects
- Responsive layouts for desktop, tablet, and mobile
- Custom CSS without Tailwind or Bootstrap
- Admin-managed services, projects, statistics, testimonials, and site content stored in MongoDB
- Reusable image and 3D model libraries
- Admin dashboard with role-based permissions
- Enquiry capture with optional SMTP notifications
- React Router navigation
- Accessible navigation and form controls

## Tech Stack

- React
- Vite
- React Router DOM
- JavaScript
- Custom CSS
- Locally bundled Inter and Playfair Display fonts
- Express and Mongoose

## Requirements

- Node.js 22.x
- npm
- MongoDB (local or hosted)

## Installation

Clone the repository or open the project directory.

Install frontend and backend dependencies:

```bash
npm install
npm --prefix backend install
```

Copy `.env.example` to `.env` and `backend/.env.example` to `backend/.env`. Configure `MONGO_URI` and a long random `JWT_SECRET` before starting the backend. Do not commit environment files.

## Development

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

In another terminal, start the API:

```bash
npm run server:dev
```

The local API listens on port 5000. The backend health endpoint is `GET /health`.

## Initial Admin

Set `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` in `backend/.env` before seeding. The seed command requires a new email and a unique password with at least 16 characters; it refuses the legacy default credentials and rotates the configured/legacy superadmin account when run.

```bash
npm run seed
```

Do not use a production seed file or share a zip containing `.env`, database exports, or customer data.

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | Vercel build environment | Public backend API base URL, ending in `/api` |
| `VITE_SITE_URL` | Vercel build environment | Canonical public website origin |
| `BACKEND_API_URL` | Vercel runtime environment | HTTPS backend origin used by the main-domain sitemap proxy |
| `SITE_URL` | Backend runtime environment | Canonical public site origin used in generated sitemap URLs |
| `FRONTEND_URL` / `FRONTEND_URLS` | Backend runtime environment | Exact allowed website origins for credentialed CORS |
| `NODE_ENV` | Backend runtime environment | Set to `production` in the production service |
| `MONGO_URI`, `JWT_SECRET` | Backend runtime environment | Database connection and token signing secret |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Backend runtime environment | Persistent production media and 3D model storage |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ENQUIRY_NOTIFICATION_EMAIL` | Backend runtime environment | Admin enquiry alerts and customer acknowledgements |
| `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD` | Backend seed environment | One-time admin creation/credential rotation; use unique values |

Set each deployment variable in the Vercel or backend provider dashboard. Keep the frontend and API on the same site (for example, through a first-party API domain or reverse proxy) so browsers can send the HttpOnly admin cookie reliably. The deployed backend origin must be HTTPS.

## Production Storage and Backups

Production 3D model uploads require configured Cloudinary storage; local upload directories are ephemeral and ignored by Git. Enquiry notification emails are sent only when all SMTP and notification-recipient variables are configured. If mail delivery fails, the enquiry remains saved and the API reports notification failure.

`npm run backup` exports database documents, including user and enquiry data, as plain JSON. Store backup output outside the repository with restricted access and an off-site encrypted backup policy. The script does not schedule or upload backups.

## Production Build

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
rcc-infrastructure/
├── public/
│   └── images/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── sections/
│   │       ├── home/
│   │       └── shared/
│   ├── data/
│   ├── pages/
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Services/
│   │   ├── Projects/
│   │   ├── Expertise/
│   │   ├── Process/
│   │   ├── Contact/
│   │   └── NotFound/
│   ├── routes/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Images

Place website images inside:

```text
public/images/
```

The application references images using paths such as:

```jsx
<img src="/images/hero.webp" alt="Construction project" />
```

Ensure the filenames match the paths used in the components and data files.

## Pages

| Page | Route |
|---|---|
| Home | `/` |
| About Us | `/about` |
| Services | `/services` |
| Service Details | `/services/:slug` |
| Projects | `/projects` |
| Project Details | `/projects/:slug` |
| Our Expertise | `/expertise` |
| Our Process | `/process` |
| Contact | `/contact` |

## Styling

The project uses custom CSS organized by purpose:

- `variables.css` — theme variables and fonts
- `global.css` — resets and global styles
- `typography.css` — text styles
- `utilities.css` — reusable utility classes
- `common.css` — shared component styles
- Individual CSS files — page and layout styling
- `responsive.css` — responsive adjustments

## Notes

- Review all seeded content and enter verified company contact details through Admin → Site Settings before deployment.
- Configure and verify the actual domain, Vercel/API origins, SMTP provider, Cloudinary, and secrets in their hosting dashboards.
- Verify all image paths before building.
- Configure your hosting provider to serve `index.html` for client-side routes and set the Vercel runtime variables used by `/sitemap.xml` and `/robots.txt`.
- The backend API is currently implicitly unversioned under `/api/auth`, `/api/public`, and `/api/admin`. Preserve those routes for compatibility; introduce a versioned prefix before making breaking API changes.
- Admin project and enquiry search uses MongoDB text indexes; searches match indexed terms rather than arbitrary substrings.
- The backend health endpoint is `GET /health`. Configure an external uptime monitor to request it every 10 minutes and alert when it does not return HTTP 200 with `status: "ok"`. Provider setup requires access to the hosting/monitoring accounts.
- Public project and service pages show a loading state while the API wakes, retry transient server/network failures once, and only show not-found after a confirmed 404.

## License

Add the applicable project license before distributing this application.
