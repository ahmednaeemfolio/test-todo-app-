import { SetMetadata } from '@nestjs/common';

/** Metadata key used to identify routes that are explicitly public. */
export const PUBLIC_ROUTE_KEY = 'isPublic';

/**
 * Marks a controller or route handler as publicly accessible.
 *
 * When applied to a controller, all of its handlers inherit the public
 * metadata unless a handler explicitly sets its own value.
 */
export const Public = () => SetMetadata(PUBLIC_ROUTE_KEY, true);
