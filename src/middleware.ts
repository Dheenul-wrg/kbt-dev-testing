import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'next-rate-limit';
import { RATE_LIMIT_CONFIG } from '@/constants/rate-limit';
import { getTranslations } from 'next-intl/server';

const authRateLimiter = rateLimit({
  interval: RATE_LIMIT_CONFIG.AUTH_WINDOW,
  uniqueTokenPerInterval: RATE_LIMIT_CONFIG.AUTH_MAX_REQUESTS,
});

const apiRateLimiter = rateLimit({
  interval: RATE_LIMIT_CONFIG.API_WINDOW,
  uniqueTokenPerInterval: RATE_LIMIT_CONFIG.API_MAX_REQUESTS,
});

export async function middleware(request: NextRequest) {
  const t = await getTranslations({ locale: 'en', namespace: 'rateLimit' });
  try {
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
      const headers = authRateLimiter.checkNext(request, 5);

      if (headers.get('X-RateLimit-Remaining') === '0') {
        console.log(`[Middleware] Auth rate limit exceeded, returning 429`);
        return NextResponse.json(
          { error: t('authExceeded') },
          { status: 429, headers }
        );
      }
      const response = NextResponse.next();
      headers.forEach((value, key) => {
        response.headers.set(key, value);
      });
      return response;
    }

    const headers = apiRateLimiter.checkNext(request, 100);
    if (headers.get('X-RateLimit-Remaining') === '0') {
      return NextResponse.json(
        { error: t('apiExceeded') },
        { status: 429, headers }
      );
    }
    const response = NextResponse.next();
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    console.error(`[Middleware] Error occurred:`, error);
    if (
      error instanceof Error &&
      error.message.includes('Rate limit exceeded')
    ) {
      return NextResponse.json(
        { error: t('generalExceeded') },
        { status: 429 }
      );
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Only match API routes
    '/api/:path*',
  ],
};
