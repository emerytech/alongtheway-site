import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.alongtheway.cc',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Keep the 404 and the form thank-you / problem pages out of the sitemap.
      filter: (page) => !/\/(404|sent|problem|applied)\/$/.test(page),
    }),
  ],
  vite: { server: { fs: { strict: true } } },
});
