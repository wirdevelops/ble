# BLE Project

A Next.js application with authentication, file sharing, and real-time features.

## Features

- Next.js 13+ with App Router
- Authentication system
- File sharing capabilities
- Real-time updates
- Supabase integration
- Prisma ORM
- Tailwind CSS for styling

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/wirdevelops/ble.git
cd ble
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env.local`
- Update the variables with your own values

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Make sure to set up the following environment variables in your `.env.local` file:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- Other required environment variables as specified in `.env.example`

## Project Structure

- `/src` - Application source code
  - `/app` - Next.js 13+ app directory
  - `/components` - React components
  - `/lib` - Utility functions and configurations
  - `/types` - TypeScript type definitions
- `/public` - Static assets
- `/prisma` - Database schema and migrations

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
