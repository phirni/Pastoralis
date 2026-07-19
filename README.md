# Internet Pastoralis

Plain, static personal site. No build step, no framework — just HTML, CSS,
and vanilla JS. Deploy target: GitHub Pages.

## Structure

```
index.html        Homepage: split-flap intro + bio
blog.html          Blog index (reads posts.json)
projects.html       Placeholder projects list
posts/             One .html file per blog post
posts.json          Manifest listing every post (title, date, slug)
style.css           All styling
quotes.js           Daily rotating quote list (Emerson / Whitman / Gita)
intro.js            Split-flap grid builder + animation
main.js             Shared behavior: copy-email button, footer year
assets/cowboy.jpg    Background image for the intro grid
```

## Preview locally

Fetch requests (used by the blog page to load `posts.json`) don't work over
`file://` in most browsers, so run a tiny local server instead of double
clicking `index.html`:

```
cd site
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Note: the intro plays once per browser **session** — if you've already seen
it in this tab session, reload will skip straight to the site. Open a new
private/incognito window to see it again, or clear session storage in dev
tools (`sessionStorage.removeItem('pastoralis_intro_seen')` in the console).

## Adding a new blog post

1. Duplicate `posts/hello-world.html`, rename it (e.g. `posts/my-new-post.html`).
2. Edit the title, date, and body text inside.
3. Add one entry to `posts.json`:

```json
{
  "slug": "my-new-post",
  "title": "My new post",
  "date": "2026-08-01",
  "excerpt": "Optional, currently unused on the list but handy for later."
}
```

That's it — it'll show up on `blog.html` automatically, sorted newest first.

## Editing the daily quotes

Open `quotes.js` and edit the `QUOTES` array directly — add, remove, or
rewrite entries freely. One is picked per calendar day (day-of-year modulo
list length), so the rotation is the same for everyone on a given date and
repeats yearly. Longer quotes wrap across more lines in the grid
automatically; very long ones may need a taller viewport to read comfortably
so keep them under ~25 words if possible.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo (e.g. `phirni/phirni.github.io` for a
   root-domain site, or any repo name + enable Pages on the `main` branch).
2. In the repo: Settings → Pages → Source: deploy from branch → `main` / root.
3. Done — no build step needed since everything here is already static.

## Editing bio content

All of the "I like / favourite authors / research interests" content lives
directly in `index.html` as plain `<li>` and `<p>` tags — edit it like a text
file, no templating involved.
