# Along the Way website

Static marketing and information website for Along the Way. Canonical address:
**https://www.alongtheway.cc**. Intended public repository: **emerytech/alongtheway-site**.

## Why Astro

Astro builds ordinary HTML and CSS from shared layouts and Markdown content. This site
has no server, runtime JavaScript, database, account forms, cookies, analytics, tracking
pixels, remote fonts, or app API calls. System serif and sans-serif fonts follow the
app’s light and dark palette. The colour scheme follows the visitor’s device preference.
The footer’s Appearance choices provide a page-only light/dark override using CSS;
the choice is not stored and new pages return to the device preference.

New content pages are one Markdown file. The home page uses an Astro layout for its
illustrated sections. Dependencies and the Node version are pinned for repeatable builds.
Astro CLI telemetry is disabled in the provided npm commands.

## Run locally

Use Node **22.23.4** (or a compatible later version) and npm. `.node-version` and
`mise.toml` both specify the tested version.

```sh
npm ci
npm run dev
```

Open the printed localhost URL, normally `http://127.0.0.1:4321/`.

With mise, first run `mise trust`, then prefix the npm commands with `mise exec --`.

```sh
npm run build
npm run check:site
npm run preview
```

`dist/` is the complete static website. The checker verifies page count, internal links
and anchors, local image references, alt attributes, one H1 per page, metadata, legal
draft labels, sitemap entries, and absence of runtime scripts, remote resources,
browser storage, local filesystem paths and common credential patterns.

## Add a page

Create `src/pages/your-page.md`:

```md
---
layout: ../layouts/PageLayout.astro
title: Your page title.
description: A concise description for search and social sharing.
intro: A welcoming sentence at the top of the page.
eyebrow: YOUR SECTION
navLabel: Your page
navOrder: 3
---

## Your first section

Write the content here.
```

This creates `/your-page/`. Remove `navOrder` if it should not appear in the main
navigation. Set `footerLabel` and `footerOrder` to add it to the footer instead.
Navigation is generated from the Markdown frontmatter. Optional `art` and `artAlt`
fields add a local illustration; optional `draft: true` shows the draft banner.
Set `noindex: true` for a review draft. The sitemap is generated during the build.

Run the build and checker, then inspect at 375px and desktop widths in both device colour
schemes. New pages are included in those checks automatically.

## Pages and content

- `/`: Home.
- `/features/`: Built features and a separate Coming later section.
- `/support/`: Contact and FAQ.
- `/delete-account/`: In-app steps and the distinction between parent and family deletion.
- `/privacy/` and `/terms/`: Clearly labelled drafts for owner/legal review, with no effective date.
- `/404.html`: GitHub Pages error page.

Keep marketing statements limited to verified built behaviour. State information must
always carry “planning aid, not legal advice”; never imply certified compliance.
Planned features belong only in Coming later, with no dates or prices. Keep the
“Coming soon to the App Store” placeholder until an official public listing exists.

Use only illustrations or invented demo data. Never publish real children’s names,
photographs, private family records, app source, internal documents or configuration secrets.
The approved brand artwork is included under `public/art/`; WebP files are optimized
copies. `public/share.png` is the supplied social image. Favicon and touch icons derive
from the app icon. NIV Scripture cards are deliberately excluded. The home-page verse
is Psalm 119:105 in the Berean Standard Bible, labelled BSB.

## Deploy to GitHub Pages

Public repository creation and the first public push require the owner’s approval.
Prepare and review the local site first. This folder is a standalone website, not a
worktree or subdirectory of the mobile app repository.

Once approved:

1. Create the public repository `emerytech/alongtheway-site` with only this website.
   Ignore `node_modules`, `.astro`, `dist`, logs and environment files. Keep the lockfile.
2. In repository **Settings → Pages**, choose **GitHub Actions** as the publishing source.
3. Set **Custom domain** to **www.alongtheway.cc**. Do this before pointing DNS at Pages.
4. Push `main`, or run **Actions → Deploy website to GitHub Pages → Run workflow**.
   The workflow installs locked dependencies, builds and checks the static output,
   uploads `dist/`, and deploys it using the built-in GitHub token. No custom secret is needed.
5. Configure the DNS records below. After GitHub’s DNS check and certificate issuance
   succeed, enable **Enforce HTTPS** in Pages settings.
6. Verify the canonical domain, root-domain redirect, all pages, images, 404, and HTTPS.

The custom domain must be set in GitHub Pages settings. This deployment uses Actions;
a `CNAME` file by itself does not configure an Actions-based Pages deployment. The Astro
`site` setting is the custom domain and there is no repository-name base path.

See [Astro’s Pages guide](https://docs.astro.build/en/guides/deploy/github/) and
[GitHub’s domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Cloudflare DNS

Keep existing API, tunnel, email-routing, MX, SPF, DKIM, DMARC, `send` and `rsend` records.
Do not change `api.alongtheway.cc`. Do not add a wildcard record.

After the Pages repository is configured for the domain, add:

| Type | Name | Content | Proxy | TTL |
| --- | --- | --- | --- | --- |
| CNAME | `www` | `emerytech.github.io` | DNS only | Auto |
| A | `@` | `185.199.108.153` | DNS only | Auto |
| A | `@` | `185.199.109.153` | DNS only | Auto |
| A | `@` | `185.199.110.153` | DNS only | Auto |
| A | `@` | `185.199.111.153` | DNS only | Auto |

Point the CNAME at the account’s hostname, **without** the repository name. With the
root and www DNS configured and www selected as the Pages domain, GitHub redirects the
root address to www. DNS-only records keep the website connection direct to Pages.

Optional IPv6 support uses four DNS-only AAAA records at `@`: `2606:50c0:8000::153`,
`2606:50c0:8001::153`, `2606:50c0:8002::153`, and `2606:50c0:8003::153`, alongside the A records.
GitHub domain verification can add a separate TXT record; use the exact value GitHub
generates for the account, not an invented or copied value.

GitHub Pages logs visitor IP addresses for security. This is disclosed separately from
the site’s absence of analytics in the draft privacy page.

## Before launch

The owner must review and adopt the privacy policy and terms, resolve the operator and
retention details identified in those drafts, and confirm the app’s public availability.
Keep the draft labels and noindex metadata until that review is complete. The app’s
App Store privacy disclosures must agree with the final policy and actual app behaviour.
