# Maria Havens POS

A modern Point of Sale system for Maria Havens Hotel built with React, Vite, and Cloudflare Workers.

## Features

- Modern React-based user interface
- TypeScript for type safety
- Tailwind CSS for styling
- Cloudflare Workers for serverless backend
- D1 Database integration
- Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/MagetoJ/mariahavenspos.git
cd mariahavenspos
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Deployment

### Vercel Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy your application using the settings in `vercel.json`

### Cloudflare Workers Deployment

For full-stack deployment with Cloudflare Workers:

```bash
npm run check
wrangler deploy
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure the required environment variables for your local development.

## Project Structure

```
src/
├── react-app/          # Frontend React application
│   ├── components/     # Reusable React components
│   ├── contexts/       # React contexts
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Utility functions
├── worker/             # Cloudflare Workers backend
└── shared/             # Shared types and utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

This app was created using [Mocha](https://getmocha.com).
Need help or want to join the community? Join our [Discord](https://discord.gg/shDEGBSe2d).
