# Editing the website content

Everything the website says lives in one file: `site.json`. Both designs read
from it, in English and Spanish. Change the text here, save, and the site
rebuilds.

## The one rule

Every piece of text has two versions, English and Spanish:

```json
"tagline": {
  "en": "A little school where Brooklyn kids grow up bilingual.",
  "es": "Una pequeña escuela donde los niños de Brooklyn crecen bilingües."
}
```

Keep the quotation marks, keep the commas between items, and don't delete the
curly braces. If something breaks, run `npm run check` and it will tell you the
line to look at.

## Where things are

| You want to change | Look for |
|---|---|
| Phone, email, address, hours | `"school"` at the top |
| Which design builds by default | `"design"` at the bottom (`sol`) |
| Contact form destination | `"school" > "formAction"` (paste a Formspree URL) |
| Tour booking link | `"school" > "tourUrl"` (paste a Calendly or Google Form link) |
| Home page headline and sections | `"home"` |
| Philosophy and Edith's bio | `"about"` |
| Daily rhythm, schedules, curriculum | `"program"` |
| Steps to enroll, requirements, fee | `"admissions"` |
| Questions and answers | `"faq"` |
| Parent quotes | `"testimonials"` |
| Photos and captions | `"photos"` (files live in `../images/`) |

## Things marked for the founder to confirm

Search this file for `CONFIRM` to find details that were written for the
remake and should be checked before launch (schedule options, tuition wording,
lunch and snack details, toileting policy, Edith's bio).
