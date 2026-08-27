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
# Redirect routes (/about, /blog) are handled by netlify.toml instead.
ROUTES = {
    "/": "index.html",
    "/about/overview": "about/overview/index.html",
    "/about/team": "about/team/index.html",
    "/about/partnerships": "about/partnerships/index.html",
    "/news": "news/index.html",
    "/resources": "resources/index.html",
    "/contact": "contact/index.html",
    "/contact/success": "contact/success/index.html",
    "/donations": "donations/index.html",
    "/api/donation_data": "api/donation_data",
    "/merch": "merch/index.html",
    "/meet-the-team": "meet-the-team/index.html",
    "/blogs": "blogs/index.html",
    "/focus/technical-projects": "focus/technical-projects/index.html",
    "/focus/community-events": "focus/community-events/index.html",
    "/focus/tech-support": "focus/tech-support/index.html",
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
        '<form action="/contact" method="POST" class="contact-form">',
        '<form name="contact" method="POST" data-netlify="true" '
        'netlify-honeypot="bot-field" action="/contact/success" class="contact-form">\n'
        '        <input type="hidden" name="form-name" value="contact">\n'
        '        <p hidden><label>Leave blank: <input name="bot-field"></label></p>',
    )
    # Newsletter form -> Netlify form named "subscribe"
    html = html.replace(
        '<form class="subscribe-form" action="/subscribe" method="post">',
        '<form class="subscribe-form" name="subscribe" method="POST" '
        'data-netlify="true" netlify-honeypot="bot-field" action="/contact/success">\n'
        '                <input type="hidden" name="form-name" value="subscribe">\n'
        '                <p hidden><label>Leave blank: <input name="bot-field"></label></p>',
    )
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

    # Snapshot the live Sheets figures once, at build time.
    print("Fetching donation data from Google Sheets...")
    donation = retry_donation_data()
    print(f"  goal={donation['goal']} total={donation['total']}")

    # Freeze the network call so the /donations render below reuses the
    # snapshot instead of making three more API calls.
    site.get_donation_data = lambda: donation

    client = site.app.test_client()
    failures = []

    for route, out in ROUTES.items():
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

    print(f"\nBuilt {len(ROUTES)} routes into {DIST}/")


if __name__ == "__main__":
    main()
