import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(10, '10s'),
      ephemeralCache: new Map(),
      prefix: '@upstash/ratelimit',
      analytics: true,
    })
  : null;

export default async function middleware(
  request: NextRequest,
  context: NextFetchEvent,
): Promise<Response | undefined> {
  if (!ratelimit) {
    return NextResponse.next();
  }

  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1';

  const { success, pending, limit, remaining } = await ratelimit.limit(ip);

  context.waitUntil(pending);

  const res = success
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/api/blocked', request.url));

  res.headers.set('X-RateLimit-Success', success.toString());
  res.headers.set('X-RateLimit-Limit', limit.toString());
  res.headers.set('X-RateLimit-Remaining', remaining.toString());

  return res;
}
