
# Dashboard Ecommerce Frontend

Modern React dashboard built with Vite, TypeScript, and Radix UI components for Plaza Lama.

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- TanStack Router for routing
- TanStack Query for data fetching
- Radix UI + shadcn/ui for components
- Tailwind CSS for styling
- Zod for validation
- Axios for API calls

## Features

- Product management system
- Product set creation and management
- Promotion handling
- Modern UI with dark mode support
- Form handling with react-hook-form
- Rich text editing with Tiptap
- Data visualization with Recharts
- Virtual scrolling support
- Toast notifications

## Project Structure

```
src/
├── api/         # API integration
├── components/  # React components
├── constants/   # App constants
├── hooks/       # Custom React hooks
├── lib/         # Utility functions
├── routes/      # Route definitions
└── types/       # TypeScript types
```

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Configuration

The API endpoint can be configured in `src/api/config.ts`. Default is `http://localhost:3000/api`.
