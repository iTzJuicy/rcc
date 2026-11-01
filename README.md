
# RCC Infrastructure

A responsive multi-page construction company website built with React, Vite, React Router, and custom CSS.

## Features

- Responsive homepage and dedicated inner pages
- About Us, Services, Projects, Expertise, Our Process, and Contact pages
- Individual service and project detail pages
- Reusable components for navigation, footer, cards, buttons, and headings
- Searchable services and filterable projects
- Responsive layouts for desktop, tablet, and mobile
- Custom CSS without Tailwind or Bootstrap
- Centralized data files for services, projects, statistics, and testimonials
- React Router navigation
- Accessible navigation and form controls

## Tech Stack

- React
- Vite
- React Router DOM
- JavaScript
- Custom CSS
- Google Fonts: Inter and Playfair Display

## Requirements

- Node.js
- npm

## Installation

Clone the repository or open the project directory.

Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

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
<img src="/images/hero.png" alt="Construction project" />
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

- Replace placeholder project details and testimonials with verified company information.
- Update contact details and email addresses before deployment.
- Verify all image paths before building.
- Configure your hosting provider to serve `index.html` for client-side routes.

## License

Add the applicable project license before distributing this application.
