"""
Build a static snapshot of the Flask site for Netlify.

Netlify has no Python runtime, so main.py cannot serve requests there.
This renders every GET route through Flask's test client and writes the
HTML to dist/, which Netlify publishes as plain files.

Usage:  ./.venv/bin/python build_static.py
Output: dist/
"""

import json
import os
import re
import shutil
import time

import main as site

DIST = "dist"

# Every GET route in main.py -> output path under dist/.
# Redirect routes (/about, /blog, /about/team, /meet-the-team) are handled by
# netlify.toml instead. Individual blog posts are added in main().
ROUTES = {
    "/": "index.html",
    "/about/overview": "about/overview/index.html",
    "/tech-interns": "tech-interns/index.html",
    "/about/partnerships": "about/partnerships/index.html",
    "/news": "news/index.html",
    "/resources": "resources/index.html",
    "/contact": "contact/index.html",
    "/contact/success": "contact/success/index.html",
    "/donations": "donations/index.html",
    "/api/donation_data": "api/donation_data",
    "/merch": "merch/index.html",
    "/blogs": "blogs/index.html",
    "/focus/technical-projects": "focus/technical-projects/index.html",
    "/focus/community-events": "focus/community-events/index.html",
    "/focus/tech-support": "focus/tech-support/index.html",
    "/events": "events/index.html",
    "/events/ai-parent-night": "events/ai-parent-night/index.html",
}


def retry_donation_data(attempts=4):
    """main.py's get_donation_data() has no retry despite its docstring.

    The Sheets API returns transient 503s, which would otherwise fail the
    whole build. Retry with backoff so a flake doesn't cost a deploy.
    """
    for i in range(attempts):
        try:
            return site.get_donation_data()
        except Exception as exc:
            if i == attempts - 1:
                raise
            wait = 2 ** i
            print(f"  donation data attempt {i + 1} failed ({exc}); retrying in {wait}s")
            time.sleep(wait)


def netlifyify_forms(html):
    """Rewrite the two Flask POST forms into Netlify Forms.

    Netlify detects forms at deploy time by the data-netlify attribute and
    the hidden form-name input, then handles submissions itself. This is a
    genuine replacement for the SMTP path, not a stub.
    """
    # Contact form -> Netlify form named "contact"
    html = html.replace(
        '<form method="POST" action="/contact" class="card" style="padding:32px">',
        '<form name="contact" method="POST" data-netlify="true" '
        'netlify-honeypot="bot-field" action="/contact/success" class="card" style="padding:32px">\n'
        '        <input type="hidden" name="form-name" value="contact">\n'
        '        <p hidden><label>Leave blank: <input name="bot-field"></label></p>',
    )
    # Newsletter form -> Netlify form named "subscribe"
    html = html.replace(
        '<form method="POST" action="/subscribe" class="subscribe">',
        '<form name="subscribe" method="POST" data-netlify="true" '
        'netlify-honeypot="bot-field" action="/contact/success" class="subscribe">\n'
        '        <input type="hidden" name="form-name" value="subscribe">\n'
        '        <p hidden><label>Leave blank: <input name="bot-field"></label></p>',
    )
    # If a template's form markup changes, the replace above silently stops
    # matching and the form posts to a Flask route that doesn't exist here.
    for dead in ('action="/contact"', 'action="/subscribe"'):
        if dead in html:
            raise SystemExit(f"netlifyify_forms: unconverted form ({dead}); "
                             "update the markup it matches in build_static.py")
    return html


# Client-side replacement for the server-side ?q= filtering in blogs().
BLOG_SEARCH_JS = """
<script>
/* Static build: blogs() filtered posts server-side via ?q=. There is no
   server on Netlify, so filter the already-rendered cards in the browser. */
(function () {
  var form = document.querySelector('.blog-search-form');
  if (!form) return;
  var input = form.querySelector('input[name="q"]');
  function cards() {
    return document.querySelectorAll('.blog-card, .featured-post, article');
  }
  function apply(q) {
    q = (q || '').trim().toLowerCase();
    cards().forEach(function (c) {
      c.style.display = !q || c.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
    });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    apply(input.value);
  });
  input.addEventListener('input', function () { apply(input.value); });
  apply(new URLSearchParams(location.search).get('q'));
})();
</script>
"""


def main():
    if os.path.isdir(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)

    routes = dict(ROUTES)
    for p in site.posts:
        routes[f"/blogs/{p['id']}"] = f"blogs/{p['id']}/index.html"

    # Snapshot the live Sheets figures once, at build time. If the Sheets
    # credentials are missing or dead, publish the page's "offline" state
    # rather than failing the whole deploy.
    print("Fetching donation data from Google Sheets...")
    try:
        donation = retry_donation_data()
        print(f"  goal={donation['goal']} total={donation['total']}")
        site.get_donation_data = lambda: donation
    except Exception as exc:
        print(f"  WARNING: donation totals unavailable ({exc}); "
              "publishing /donations without live figures")
        routes.pop("/api/donation_data")

        def unavailable():
            raise RuntimeError("donation data unavailable at build time")
        site.get_donation_data = unavailable

    client = site.app.test_client()
    failures = []

    for route, out in routes.items():
        resp = client.get(route)
        if resp.status_code != 200:
            failures.append((route, resp.status_code))
            print(f"  FAIL {route} -> {resp.status_code}")
            continue

        body = resp.get_data(as_text=True)
        if out.endswith(".html"):
            body = netlifyify_forms(body)
            if route == "/blogs":
                body = body.replace("</body>", BLOG_SEARCH_JS + "</body>")

        path = os.path.join(DIST, out)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            f.write(body)
        print(f"  ok   {route} -> dist/{out}")

    shutil.copytree("static", os.path.join(DIST, "static"))
    print("  ok   static/ -> dist/static/")

    if failures:
        raise SystemExit(f"\nBuild failed, {len(failures)} route(s) not 200: {failures}")

    print(f"\nBuilt {len(routes)} routes into {DIST}/")


if __name__ == "__main__":
    main()
