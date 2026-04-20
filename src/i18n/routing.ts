import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed', // ES has no prefix (/), EN has /en/ prefix
  pathnames: {
    '/': '/',
    '/apartamentos': { es: '/apartamentos', en: '/apartments' },
    '/apartamentos/[slug]': { es: '/apartamentos/[slug]', en: '/apartments/[slug]' },
    '/reserva': { es: '/reserva', en: '/book' },
    '/contacto': { es: '/contacto', en: '/contact' },
    '/galeria': { es: '/galeria', en: '/gallery' },
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/admin': '/admin',
  }
});
