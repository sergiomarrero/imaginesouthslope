# Photos

Drop photos into this folder using these exact file names. Any slot that is
missing shows a tasteful placeholder until the photo arrives, so the site
never looks broken.

| File name | Where it appears | What works best |
|---|---|---|
| `hero.jpg` | Top of the home page | Landscape, children at work in the studio, lots of light |
| `classroom-1.jpg` | Home gallery, About | Shelves with materials at child height |
| `classroom-2.jpg` | Home gallery, Program | A child doing practical-life work (pouring, slicing) |
| `circle.jpg` | Home gallery, Program | Circle time, songs or a story |
| `playground.jpg` | Home gallery, Program | JJ Byrne Playground on a sunny day |
| `music.jpg` | Program | Music class |
| `edith.jpg` | Home, About | Portrait of Edith, ideally in the classroom, square crop works |
| `studio.jpg` | About, Contact | The empty studio: wood floors, tall windows |
| `materials.jpg` | Program | Sensorial materials on a rug |
| `art.jpg` | Home gallery | Art table |
| `room.jpg` | About hero, home gallery lead | The whole classroom: windows, floors, tables |
| `books.jpg` | Home gallery, Program day | The Spanish book rack |
| `movement.jpg` | Home gallery, About | Climbing or movement indoors |
| `culture.jpg` | Home gallery | The world map corner |

To choose which part of a photo stays visible when it is cropped, add `"focus": "50% 60%"` to its entry in `content/site.json` (left-right, then top-bottom).

Tips: JPG or WebP, at least 1600 px on the long side, under 500 KB each if
possible. Get written permission from families before publishing children's
faces, or choose photos taken from behind or of hands at work.

To reuse photos from the old site, run `npm run pull-site` on a normal
internet connection. They land in `images/site/` with a manifest; copy the
best ones here with the names above.
