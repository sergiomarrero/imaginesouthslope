# Imagine South Slope Montessori — website remake

A mobile-first, bilingual website for [Imagine South Slope Montessori](https://southslopemontessori.com),
the Montessori preschool taught entirely in Spanish at Brooklyn Arts Exchange in Park Slope.
One content file drives every page in English and Spanish, and nothing beyond Node is needed to build it.

**Live preview:** https://sergiomarrero.github.io/imaginesouthslope/ (Spanish: `/es/`)

The site uses the **Sol** design: sunny and playful, butter-yellow paper, a marigold sun, cobalt buttons.
A second direction, **Bosque** (calm, forest green, grotesk headlines), is kept in `src/designs/bosque`
for reference. `DESIGNS=sol,bosque npm run build` builds both side by side with a chooser page;
`content/site.json` > `design` picks the default.

Who the site speaks to: Park Slope families raising young children with Spanish at home, who want a
small, real Montessori classroom where the whole day happens in Spanish. Families new to Spanish are
welcomed on every page, but the lead is Montessori quality first, then what a full day in Spanish does
for a bilingual child.

## What is in the box

- **Five pages:** Home, About, Our Program, Admissions, Contact. Every page in English and Spanish, with a one-tap language switch.
- **All the original content**, recovered and recorded in `content/ORIGINAL-SITE-CONTENT.md`, plus new sections written to win over young parents: why Spanish immersion at 2–5, how immersion works, a sample day, schedules, tuition guidance, FAQ, parent quotes, directions.
- **Made for phones first:** sticky call and tour buttons, thumb-sized tap targets, a full-screen menu, horizontal swipe cards, an accordion FAQ, a photo lightbox.
- **Built for enrollment:** a tour request form (email fallback, or Formspree when configured), click-to-call and click-to-email everywhere, a map, and `Preschool` structured data so the school shows up well in local search.
- **Easy for the founder:** one JSON file to edit, photos dropped into one folder, a checker that explains mistakes in plain language, and a GitHub Pages workflow that publishes on every push to `main`.

## Quick start

```bash
npm run check      # validates content/site.json and lists items to confirm
npm run build      # writes the site to dist/ (DESIGNS=sol,bosque for both designs)
npm run preview    # serves dist/ at http://localhost:4173
```

There are no dependencies to install. Node 18 or newer is enough.

## Editing content

Open `content/site.json`. Every piece of text has an English and a Spanish
version. `content/README.md` explains the layout and lists the items marked
`_confirm` that the founder should check before launch (schedule options,
tuition wording, lunch and snack details, Edith's bio, and so on).

## Photos

Put photos in `images/` using the file names listed in `images/README.md`.
Missing photos show a designed placeholder, so the site never looks broken.

To reuse the photos from the current site, run this on a normal internet
connection (the build environment used for this remake could not reach the
old site, so the photos have not been copied yet):

```bash
npm run pull-site
```

That downloads each page's text into `content/pulled/` and every image into
`images/site/` with a manifest. Copy the best ones into `images/` under the
slot names, then rebuild.

## Making the form and tour button work

- **Form:** create a free form at [formspree.io](https://formspree.io), copy its endpoint (`https://formspree.io/f/xxxx`) into `school.formAction` in `content/site.json`. Until then, the form opens the parent's email app with everything pre-filled.
- **Tour booking:** paste a Calendly or Google Form link into `school.tourUrl`. Until then, "Book a tour" buttons scroll to the contact form.

## Publishing

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) builds
the site on every push to `main` and publishes `dist/` to the `gh-pages`
branch, which GitHub Pages serves at
https://sergiomarrero.github.io/imaginesouthslope/. If the page is not live,
open the repository's Settings, choose Pages, and pick the `gh-pages` branch
as the source. The workflow sets `SITE_BASE_URL` so canonical and hreflang
links are absolute; change it there if the site moves to its own domain.

To put the site live on the school's own domain, deploy the contents of
`dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GoDaddy static
hosting) and change `SITE_BASE_URL` in the workflow to the new address.

## Project layout

```
content/site.json          all text, EN + ES, plus phone, hours, photo captions
content/ORIGINAL-SITE-CONTENT.md   verbatim text recovered from the old site
images/                    photo slots (see images/README.md)
src/build.mjs              renders designs x pages x languages to dist/
src/check.mjs              content validator with friendly errors
src/serve.mjs              local preview server
src/lib.mjs                shared helpers: localization, links, SEO head, form, FAQ
src/shared/app.js          shared front-end behaviors (menu, reveal, carousel, form, lightbox)
src/shared/icons.mjs       line icon set
src/designs/sol/           the chosen design: templates, styles, extras
src/designs/bosque/        alternative design kept for reference
scripts/pull-site.mjs      downloads the live site's pages and images
```
