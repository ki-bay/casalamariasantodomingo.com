// EN alias — resolves /en/apartments/[slug] → same detail page
export const runtime = 'edge';
export { default, generateMetadata } from '@/app/[locale]/apartamentos/[slug]/page';
