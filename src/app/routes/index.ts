import { Router } from 'express';

const router = Router();

const moduleRoutes = [
  {
    path: '/menu',
    route: () => {}, // পরে আপনার MenuRoutes এখানে আসবে
  },
  {
    path: '/booking',
    route: () => {}, // পরে আপনার BookingRoutes এখানে আসবে
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;