/* eslint-disable import/no-default-export */
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/book', '/book(.*)', '/borrow', '/borrow(.*)'],
  ignoredRoutes: ['/api(.*)'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
