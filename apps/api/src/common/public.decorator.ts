import { SetMetadata } from '@nestjs/common';

/** Metadata key consumed by PublicRouteGuard to identify public routes. */
export const PUBLIC_ROUTE_KEY = 'isPublic';

/**
 * Marks a controller or route handler as public.
 *
 * Controller metadata applies to all of its handlers; handler metadata takes
 * precedence when the guard resolves the two levels of metadata.
 */
export const Public = () => SetMetadata(PUBLIC_ROUTE_KEY, true);
