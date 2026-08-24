# Not Shawarmer

Not Shawarmer is a full-stack restaurant ordering and delivery-management application built as a collaborative bachelor’s project. It provides separate customer and administrator experiences, covering the workflow from browsing a menu and placing an order to dispatch, delivery tracking, order history, and ratings.

The repository is being polished as a public software-engineering portfolio project for postgraduate AI applications.

## Features

### Customer experience

- Account registration, credentials-based authentication, and profile management
- Restaurant menu browsing, category filtering, and search
- Persistent cart with delivery instructions and fee calculation
- Address selection and map-based delivery locations
- Order placement, live status updates, and delivery ETA/path display
- Current and past order views
- Delivered-order ratings
- Responsive loading, confirmation, and error states

### Administrator experience

- Role-protected administrator dashboard
- Menu item and category management
- Image upload support through Cloudinary
- Restaurant details, location, hours, contact, and delivery-fee editing
- Current and past order management
- Order status updates from cooking through delivery
- Administrator profile management

## Technology

- **Application:** Next.js 15 App Router, React 19, TypeScript
- **Styling:** Tailwind CSS 4 and Heroicons
- **Authentication:** Auth.js / NextAuth credentials authentication
- **Database:** PostgreSQL, accessed with the `postgres` client
- **Data synchronization:** SWR
- **Validation:** Zod
- **Maps and routing:** Leaflet, React Leaflet, OpenStreetMap/Nominatim, and GraphHopper
- **Media:** Cloudinary
- **Notifications:** React Hot Toast

## Local setup

### Prerequisites

- Node.js 20 or newer
- npm
- An initialized PostgreSQL database
- A Cloudinary account if administrator image uploads are required

### 1. Clone and install

```bash
git clone https://github.com/TokenlessLabs/Not-Shawarmer.git
cd Not-Shawarmer
npm install
```

### 2. Configure environment variables

Create a `.env` file in the repository root:

```env
POSTGRES_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AUTH_SECRET="replace-with-a-long-random-secret"

# Required for administrator image uploads
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Generate a suitable authentication secret with:

```bash
npx auth secret
```

Never commit `.env` or real credentials. The repository’s `.gitignore` excludes environment files.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `localhost` consistently rather than switching between it and `127.0.0.1`, because authentication cookies are host-specific.

### 4. Verify the project

```bash
npm run lint
npx tsc --noEmit
npm run build
```

### Production mode

After a successful build:

```bash
npm run start
```

## Application routes

| Area | Routes |
| --- | --- |
| Authentication | `/`, `/signup` |
| Customer | `/user/dashboard`, `/user/dashboard/cart`, `/user/orders`, `/user/orders/past` |
| Delivery | `/user/orders/[orderid]/delivery` |
| Shared profile | `/profile`, `/profile/changepassword` |
| Administrator | `/admin/dashboard`, `/admin/orders`, `/admin/orders/past-order`, `/admin/editrestaurant` |

## Contributors

The summaries below are based on the repository’s Git history. Many features were developed collaboratively, reviewed through pull requests, and refined across multiple branches, so some areas naturally overlap.

### Meerab — [`fastcel`](https://github.com/fastcel)

- Developed and stabilized core customer ordering workflows, including cart submission, order placement, delivery fees, confirmation states, and address handling.
- Implemented delivery-related functionality such as address display, map integration, route/ETA behavior, and delivery-page data updates.
- Added SWR-based synchronization across dashboards, orders, sidebars, sessions, and order-handling flows.
- Built loading states and contributed restaurant-editing improvements, UI refinements, integration work, and broad bug fixing.
- Managed and integrated collaborative pull requests across the project.

### Shehryar Hassan — [`shehryarhassan789`](https://github.com/shehryarhassan789)

- Strengthened authentication and database-schema behavior and implemented profile and account-deletion improvements.
- Developed and refined cart, ordering, address validation, maps, confirmation dialogs, and delivery-related user experiences.
- Improved administrator functionality, including restaurant editing, search/debounce behavior, order interfaces, and administrator-specific validation.
- Fixed timezone, layout, loading, animation, error-state, and TypeScript issues throughout the application.
- Contributed extensive cross-feature debugging and refinement through dedicated feature and bug-fix branches.

### Faria — [`fariarafique27`](https://github.com/fariarafique27)

- Built early administrator and customer dashboard interfaces, menu/item presentation, and administrator order-routing views.
- Implemented major parts of the cart across local-storage, server-action, database-persistence, delivery-instruction, and order-placement iterations.
- Contributed authorization and login server actions, signup validation/error handling, and profile/sidebar integration.
- Added loading experiences, SWR adoption, order-interface fixes, and delivered-order rating functionality.
- Helped integrate and review collaborative feature branches through pull requests and merge work.

## Deployment notes

The application can be deployed to a Next.js-compatible host such as Vercel. Configure all environment variables in the hosting provider, connect the production PostgreSQL database, and run `npm run build` before release.

The `/seed` route recreates database tables and data and is destructive. It is available only during local development and returns `404` in production and Vercel preview deployments. Initialize a hosted database from a trusted local environment before deploying the application.

## Collaboration policy

This project preserves the work and history of all collaborators. Major architectural changes, framework or database migrations, substantial redesigns, feature removal, authentication-flow changes, or broad dependency replacements require the repository owner’s explicit approval.

Focused bug fixes, tests, documentation, accessibility improvements, and low-risk maintenance should remain easy to review and should be verified before merging.

## Current status

The application is under active portfolio polishing. The current branch has been verified with ESLint, TypeScript checking, and a full Next.js production build. Remaining image-related lint notices are performance recommendations rather than build failures.
