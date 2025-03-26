import { createRouteHandler } from './generate';

export const Get = createRouteHandler('GET');

export const Post = createRouteHandler('POST');

export const Put = createRouteHandler('PUT');

export const Delete = createRouteHandler('DELETE');

export const Patch = createRouteHandler('PATCH');

export const Head = createRouteHandler('HEAD');

export const Options = createRouteHandler('OPTIONS');
