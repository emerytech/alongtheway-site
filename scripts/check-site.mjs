import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve('dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name)))).flat();
}
const files = await walk(root);
const htmlFiles = files.filter(p => p.endsWith('.html'));
assert(htmlFiles.length >= 7, 'Expected at least the six public pages and 404.');
for (const required of ['index.html','features/index.html','support/index.html','privacy/index.html','terms/index.html','delete-account/index.html','404.html']) assert(files.includes(path.join(root,required)), `Missing required page: ${required}`);
for (const filename of htmlFiles) {
  const html = await readFile(filename, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${filename}: exactly one h1`);
  assert.match(html, /<html lang="en"/, `${filename}: document language`);
  assert.match(html, /href="#main"/, `${filename}: skip link`);
  assert.match(html, /property="og:image"/, `${filename}: share image`);
  assert.match(html, /rel="canonical"/, `${filename}: canonical URL`);
  assert.doesNotMatch(html, /<script\b/i, `${filename}: static pages must have no scripts`);
  assert.doesNotMatch(html, /<iframe\b|<form\b|fonts\.google|googletagmanager|google-analytics|cloudflareinsights|NIV|api\.alongtheway\.cc/i, `${filename}: disallowed dependency or content`);
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(image[0], /\balt="[^"]*"/, `${filename}: every image needs an alt attribute`);
    assert.match(image[0], /\bwidth="\d+"/, `${filename}: every image needs a width`);
    assert.match(image[0], /\bheight="\d+"/, `${filename}: every image needs a height`);
  }
  for (const match of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const value = match[2].replaceAll('&amp;', '&');
    if (/^(https?:|mailto:|data:)/.test(value)) {
      if (match[1] === 'src') throw new Error(`External resource: ${value}`);
      continue;
    }
    const [pathname, fragment] = value.split('#');
    let target = pathname ? path.resolve(root, '.' + (pathname.startsWith('/') ? pathname : '/' + path.posix.join(path.relative(root, path.dirname(filename)), pathname))) : filename;
    if (pathname.endsWith('/')) target = path.join(target, 'index.html');
    const info = await stat(target).catch(() => null);
    assert(info?.isFile(), `${filename}: broken ${match[1]} ${value}`);
    if (fragment && target.endsWith('.html')) {
      const targetHtml = await readFile(target, 'utf8');
      assert(targetHtml.includes(`id="${fragment}"`), `${filename}: missing anchor ${value}`);
    }
  }
}
for (const legal of ['privacy', 'terms']) {
  const html = await readFile(path.join(root, legal, 'index.html'), 'utf8');
  // Adopted by the owner on 2026-11-12: each carries an effective date and the operator's name.
  assert.match(html, /Effective November 12, 2026/);
  assert.match(html, /ETS3D LLC/);
  assert.doesNotMatch(html, /DRAFT/);
}
for (const file of files.filter(p => /\.(css|html)$/.test(p))) {
  const text = await readFile(file, 'utf8');
  assert.doesNotMatch(text, /(?:@import|@font-face)|url\(["']?https?:|document\.cookie|localStorage|sessionStorage/i, 'No remote assets, cookies or browser storage');
  assert.doesNotMatch(text, /\/Users\/|server\/\.env|mobile\/\.env|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|(?:sk_live_|sk-proj-|ghp_)/, 'No local paths or credential material');
}
const sitemap = (await Promise.all(files.filter(p => /sitemap.*\.xml$/.test(p)).map(p => readFile(p, 'utf8')))).join('');
for (const url of ['/', '/features/', '/support/', '/privacy/', '/terms/', '/delete-account/']) assert(sitemap.includes(`https://www.alongtheway.cc${url}<`), `Sitemap missing ${url}`);
assert(!sitemap.includes('/404'));
assert.match(await readFile(path.join(root, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/www\.alongtheway\.cc\/sitemap-index\.xml/);
console.log(`Passed: ${htmlFiles.length} pages; internal links and anchors; local images; headings; legal pages dated and named; sitemap; no scripts, trackers, storage or credential patterns.`);
