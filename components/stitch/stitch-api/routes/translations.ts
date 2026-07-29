/**
 * MOCK ROUTES - Translations
 * Returns language pack data for preview/development environments.
 * Base path: /translations
 */

import { Hono } from 'hono';
import { en, hi, gu, ma } from '@api-banking/fixed-deposit.language-packs';

const languagePacks: Record<string, Record<string, unknown>> = { en, hi, gu, ma };

export const translationsRoutes = new Hono()
  .use('*', async (c, next) => { await next(); c.header('X-Source', 'mock'); })
  .get('/:lang', (c) => {
    const lang = c.req.param('lang');
    const pack = languagePacks[lang] ?? languagePacks.en;
    return c.json(pack);
  });
