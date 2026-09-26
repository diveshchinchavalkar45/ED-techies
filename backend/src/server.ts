import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api';
import { isSupabaseConnected } from './config/supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow Vercel frontend or local dev
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apikey'],
}));
app.use(express.json());

// Request logger for Render monitoring
app.use((req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  next();
  const ms = Date.now() - start;
  console.log(`[${req.method}] ${req.originalUrl} - ${ms}ms`);
});

// Root welcome & API Router
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'TeamSync AI API Service',
    description: 'Autonomous team balancing & lifecycle coach API',
    endpoints: {
      health: '/api/health',
      projects: '/api/projects/:id',
      generateTeams: '/api/projects/:id/teams/generate',
    },
    supabaseStatus: isSupabaseConnected() ? 'Configured & Active' : 'Pending API credentials',
  });
});

app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
});

// Start Server on 0.0.0.0 (required for Render)
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`
  =======================================================
  🚀 TeamSync AI Backend Engine Running
  -------------------------------------------------------
  📡 Local Port:      http://localhost:${PORT}
  🏥 Health Check:    http://localhost:${PORT}/api/health
  🗄️ Supabase Status:  ${isSupabaseConnected() ? 'Connected' : 'In-Memory Mock (Add SUPABASE_URL to .env)'}
  🌍 Ready for Render Cloud Deployment
  =======================================================
  `);
});
