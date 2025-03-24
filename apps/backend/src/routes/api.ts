import { Router } from 'express';
import caseStudiesRouter from './case-studies';
import blogPostsRouter from './blog-posts';
import profileRouter from './profile';
import contactRouter from './contact';
import adminRouter from './admin';
import { validateAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.use('/case-studies', caseStudiesRouter);
router.use('/blog-posts', blogPostsRouter);
router.use('/profile', profileRouter);
router.use('/contact', contactRouter);

// Protected admin routes
router.use('/admin', validateAuth, adminRouter);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;