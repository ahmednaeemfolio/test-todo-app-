import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ROUTE_KEY } from './public.decorator';

/** Allows requests only when the handler or its controller is explicitly public. */
@Injectable()
export class PublicRouteGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic ?? false;
  }
}
