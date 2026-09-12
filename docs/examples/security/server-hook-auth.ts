// Shared-secret guard for server endpoints such as:
// - POST /api/public/hooks/backfill-posts
// - POST /api/public/hooks/sync-blog
//
// The endpoint should reject requests unless the caller supplies the configured
// secret in `x-hook-secret`. Prefer an HMAC signature if the caller can sign the
// raw request body; this simple shared-secret guard is the minimum acceptable gate.
import { timingSafeEqual } from 'node:crypto';

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function requireHookSecret(request: Request): Response | null {
  const expected = process.env.SERVER_HOOK_SECRET;
  if (!expected) {
    return Response.json({ error: 'SERVER_HOOK_SECRET is not configured' }, { status: 500 });
  }

  const actual = request.headers.get('x-hook-secret') ?? '';
  if (!actual || !safeEqual(actual, expected)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  return null;
}

// Usage inside a route handler:
// export async function POST(request: Request) {
//   const unauthorized = requireHookSecret(request);
//   if (unauthorized) return unauthorized;
//   // Continue with service-role work.
// }
