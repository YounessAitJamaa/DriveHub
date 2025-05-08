# DriveHub Experience

A modern web application for managing driving lessons and bookings.

## Features

- User authentication and authorization
- Course booking system
- Payment processing with Stripe
- Admin dashboard
- Responsive design

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Stripe

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
