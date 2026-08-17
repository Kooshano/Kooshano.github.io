# kooshan.info

Personal site for Kooshan Maleki. Plain static HTML, CSS and JavaScript served by
GitHub Pages. No build step, no framework, no dependencies to install.

## Layout

```
index.html      Home: full-screen hero, short bio, publications, contact
cv/index.html   Full CV, served at /cv
styles.css      All styling for both pages
script.js       Theme toggle, hero canvas, GitHub star counts
static/         Images, logos and CV.pdf
```

## Design

Grayscale only. There is no accent colour anywhere: links are body-coloured with an
underline, and emphasis comes from weight and spacing. Type is Newsreader with
oldstyle numerals, plus JetBrains Mono for dates, venues and tags. The hero stays
dark in both themes; everything below follows the light/dark toggle.

The toggle stores its choice in `localStorage` and falls back to
`prefers-color-scheme`. An inline script in `<head>` applies the theme before first
paint so there is no flash of the wrong one.

## Editing

- **Bio prose**: the paragraphs under "Hello 👋" in `index.html`. An HTML comment
  marks where a paragraph about life outside research would go.
- **CV content**: `cv/index.html`, one `<section>` per heading, flat and fully
  expanded so the page can be read straight through or printed.
- **Publications**: the `.entry` block appears on both pages; keep them in sync.
- **Star counts**: any link with `data-repo="owner/name"` gets its GitHub star count
  filled in at load. If the API is rate-limited the counter is removed rather than
  showing an error.

## Images

`static/` holds only what the two pages actually reference: WebP images resized to the
size they render at, the favicon, a JPEG for link previews, and the CV PDF. Full-size
originals are deliberately not kept here, since GitHub Pages serves everything in the
repository.

To add an image, resize it on the way in:

```sh
cwebp -q 82 -resize 1200 0 ~/somewhere/figure.png -o static/figure.webp
```

Earlier originals (the paper figures, certificates and draw.io logo exports) were
removed in the commit that trimmed `static/` from 17 MB to 448 KB. They are still in
git history, so any one of them can be recovered:

```sh
git log --oneline --diff-filter=D -- static/    # find the commit
git show <commit>^:static/Novelty.png > Novelty.png
```

## Local preview

```sh
python3 -m http.server 8000
```

Then open <http://127.0.0.1:8000>. `/cv` resolves through `cv/index.html`, the same
way GitHub Pages serves it.
