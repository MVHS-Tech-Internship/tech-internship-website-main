import os
import csv
import json
import smtplib

from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import time
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
import http.client as httplib

from flask import Flask, render_template, request, redirect, url_for, jsonify 

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Configuration for Google Sheets API
SPREADSHEET_ID = '1pHalAmKyjUxqVlwX2rSWQupXxUinjB4wUB2BroKZgB8' 
SERVICE_ACCOUNT_FILE = 'credentials.json'

# The range where the Goal (A1) and Total Raised (C2) figures are located
READ_RANGE = 'Sheet1!A1:C2'

# Define the scope for read-only access to Google Sheets
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

def get_donation_data():
    """
    Fetches the donation goal and total raised from the Google Sheet.
    Includes exponential backoff for API robustness.
    """    
    # Load credentials from the service account file
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    
    # Build the Sheets API service object
    service = build('sheets', 'v4', credentials=creds)

    sheet = service.spreadsheets()

    # Call the Sheets API to get the values
    result = sheet.values().get(
        spreadsheetId=SPREADSHEET_ID, 
        range=READ_RANGE,
    ).execute()
    
    # The result structure is a list of lists: [[Goal], [Total Raised]]
    values = result.get('values', [])

    goal = values[0][0]
    total_raised = values[1][2]

    return {
        'goal': goal,
        'total': total_raised
    }


# ---------------------------------------------------------------------------
# ROADMAP - drives the scroll-driven road on the home page.
#
# Every entry below is drawn from content already on the site. Where a date has
# not been publicly announced, `tba` is True and the label reads "Date TBA" -
# do not replace those with invented dates. Fill them in as they're confirmed.
# Order = left-to-right order along the road.
# ---------------------------------------------------------------------------
ROADMAP = [
    {
        "date": "Ongoing",
        "tba": False,
        "color": "#3B7DD8",
        "title": "On-Campus Tech Support",
        "blurb": "Peer tech help and systems like the tech support form and "
                 "internal support processes.",
        "href": "/focus/tech-support",
        "cta": "How it works",
        "image": "tech-support.jpg",
        "image_alt": "Tech interns working together on laptops at a table on campus",
    },
    {
        "date": "Ongoing",
        "tba": False,
        "color": "#2E9E75",
        "title": "Knowt Partnership",
        "blurb": "Interns evaluate the platform with a student-designed rubric "
                 "and share structured feedback directly with Knowt.",
        "href": "/about/partnerships",
        "cta": "Our partners",
        "image": "knowt-logo.png",
        "image_alt": "Knowt logo",
        "image_fit": "contain",
    },
    {
        "date": "September 29, 2026",
        "tba": False,
        "color": "#E8543F",
        "title": "AI & Education Parent Night",
        "blurb": "65 parents, four guest speakers, and one question: what "
                 "does AI mean for our students?",
        "href": "/events/ai-parent-night",
        "cta": "See the recap",
        "image": "events/ai-parent-night/hero.jpg",
        "image_alt": "Panelists on stage at AI & Education Parent Night",
    },
    {
        "date": "January 26-29, 2027",
        "tba": False,
        "color": "#F2A93B",
        "title": "FETC 2027",
        "image": "fetc-logo.jpg",
        "image_alt": "FETC logo",
        "image_fit": "contain",
        "blurb": "Three sessions at the Future of Education Technology "
                 "Conference on student-led innovation and AI in schools.",
        "href": "https://www.fetc.org/",
        "external": True,
        "cta": "Visit FETC",
    },
    {
        "date": "Date TBA",
        "tba": True,
        "color": "#8B5CF6",
        "title": "AI Philosophy Workshops",
        "blurb": "Details coming soon.",
        "href": "/focus/community-events",
        "cta": "Community events",
    },
]



@app.route('/')
def index():
    """Home Page"""
    return render_template('index.html', roadmap=ROADMAP)


@app.route('/about')
def about():
    """About Us Page - Redirect to overview"""
    return redirect(url_for('about_overview'))


@app.route('/about/overview')
def about_overview():
    """Overview & Mission Page"""
    return render_template('about_overview.html')


# ---------------------------------------------------------------------------
# TEAM - drives /tech-interns.
#
# Photos live in static/images/team/. An intern with no "photo" key gets an
# initials tile; to add one, save <first-last>.jpg there (portrait, ~720px
# tall) and add "photo": "<first-last>.jpg" to their entry.
# ---------------------------------------------------------------------------
PRINCIPAL = {
    "name": "Kip Glazer, Ed.D.",
    "role": "Principal, Mountain View High School",
    "photo": "kip-glazer.jpg",
    "linkedin": "https://www.linkedin.com/in/kip-glazer-09a26933/",
}

# 2026-27 e-board, in the order of the e-board slide. "linkedin" is optional.
EBOARD = [
    {"name": "Cinty Lin", "year": "2027", "photo": "cinty-lin.jpg"},
    {"name": "Jayan Nair", "year": "2028", "photo": "jayan-nair.jpg"},
    {"name": "Myra Jain", "year": "2028", "photo": "myra-jain.jpg",
     "linkedin": "https://www.linkedin.com/in/myra-jain2010/"},
    {"name": "Yash Maheshwari", "year": "2027", "photo": "yash-maheshwari.jpg",
     "linkedin": "https://www.linkedin.com/in/yashmaheshwari2009/"},
    {"name": "Keshav Pillutla", "year": "2027", "photo": "keshav-pillutla.jpg"},
    {"name": "Emma Teng", "year": "2027", "photo": "emma-teng.jpg"},
]

# 2026-27 interns not on the e-board, by last name.
INTERNS = [{"name": n} for n in [
    "Raya Aghazadeh", "Mihika Bobbarjung", "Alec Corcoran", "Manuel Diuk",
    "Emma Fei", "Ilan Gerber", "Rishi Jindal", "Colby Liu", "Caroline Yu",
    "Nathalie Zhang",
]]


@app.route('/tech-interns')
def tech_interns():
    """Tech Interns Page - e-board, principal, interns"""
    return render_template('team.html', principal=PRINCIPAL,
                           eboard=EBOARD, interns=INTERNS)


@app.route('/about/team')
def about_team():
    """Old team URL"""
    return redirect(url_for('tech_interns'), code=301)


@app.route('/about/partnerships')
def about_partnerships():
    """Partnerships Page"""
    return render_template('about_partnerships.html')


@app.route('/news')
def news():
    """News & Media Page"""
    return render_template('news.html')


@app.route('/resources')
def resources():
    """Home Page"""
    return render_template('resources.html')


def send_email(to_address, subject, body):
    """
    Send an email using SMTP.
    Uses environment variables for SMTP configuration.
    """
    # Get SMTP configuration from environment variables
    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_username = os.environ.get('SMTP_USERNAME')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    # If credentials are not set, print error and return False
    if not smtp_username or not smtp_password:
        print("Error: SMTP_USERNAME and SMTP_PASSWORD environment variables must be set")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = to_address
        msg['Subject'] = subject
        
        # Add body to email
        msg.attach(MIMEText(body, 'plain'))
        
        # Create SMTP session
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Enable security
        server.login(smtp_username, smtp_password)
        
        # Send email
        text = msg.as_string()
        server.sendmail(smtp_username, to_address, text)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact Us Page"""
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # Build the email content
        subject = "New message from MVHS Tech Internship contact form"
        body = f"Name: {name}\nMVHS Email: {email}\n\nMessage:\n{message}"
        
        # Send the email to mvhs.tech24@gmail.com using SMTP.
        # If SMTP is not configured the send fails silently, so the submission is
        # also written to contact_submissions.csv - the page tells the visitor
        # their message was sent, and nothing should be lost when it wasn't.
        sent = send_email("mvhs.tech24@gmail.com", subject, body)
        if not sent:
            app.logger.error(
                "Contact form email NOT sent (check SMTP_USERNAME/SMTP_PASSWORD). "
                "Submission saved to contact_submissions.csv instead.")
            try:
                with open('contact_submissions.csv', 'a', newline='') as fh:
                    csv.writer(fh).writerow(
                        [datetime.utcnow().isoformat(), name, email, message])
            except Exception as exc:
                app.logger.error("Could not save contact submission: %s", exc)

        # Redirect to success page
        return redirect(url_for('contact_success'))
    
    return render_template('contact.html')


@app.route('/contact/success')
def contact_success():
    """Contact form success page"""
    return render_template('contact_success.html')


@app.route('/donations')
def donations():
    """
    Donations Page: Now fetches dynamic data from Google Sheets
    and passes it to the template.
    """
    # The Sheets call can fail (expired/removed service account, quota, network).
    # Never let that take the whole page down - fall back to no live figures.
    try:
        data = get_donation_data()
        return render_template('donations.html',
                               goal=data['goal'],
                               total=data['total'],
                               error=None)
    except Exception as exc:
        app.logger.warning("Donation figures unavailable: %s", exc)
        return render_template('donations.html',
                               goal=None,
                               total=None,
                               error="Live totals are temporarily unavailable.")

@app.route('/api/donation_data')
def donation_api():
    """API endpoint to return raw JSON data for asynchronous updates (optional)."""
    try:
        return jsonify(get_donation_data())
    except Exception as exc:
        app.logger.warning("Donation figures unavailable: %s", exc)
        return jsonify({"error": "unavailable"}), 503


@app.route('/merch')
def merch():
    """Merch Page"""
    return render_template('merch.html')


@app.route('/meet-the-team')
def meet_the_team():
    """Old team URL"""
    return redirect(url_for('tech_interns'), code=301)

def load_posts():
    try:
        with open("blog_data.json", "r") as j:
            return json.load(j)
    except FileNotFoundError:
        print("error: blog_data.json is not found")
        return []
    except json.JSONDecodeError:
        print("ERROR: blog_data.json is invalids")
        return []


# --- IMPORTANT NOTE ---
# Posts 9 and 10 (Caroline Yu, Raya Aghazadeh) and post 2 (Sean Lin) are
# written by interns. Posts 1 and 3-8 are AI-generated placeholders under
# invented bylines, so they carry "draft": true and are not published. To
# publish one, replace its "content", "excerpt" and "author" with real
# writing and delete its "draft" key.
#
# Note that blog_data.json is read once at import, so the server must be
# restarted for edits to it to take effect.
posts = [p for p in load_posts() if not p.get("draft")]

@app.route("/blog")
def blog():
    """Legacy blog route - redirects to /blogs"""
    return redirect(url_for('blogs'))


@app.route("/blogs", methods=['GET', 'POST'])
def blogs():
    """MVHS Tech Blog Page with search functionality"""
    query = request.args.get('q', '').strip().lower()
    subscribed_message = request.args.get('subscribed_message', '')
    
    # Filter posts by query (title, categories, tags, or excerpt)
    if query:
        filtered_posts = [
            p for p in posts
            if query in p["title"].lower()
            or any(query in c.lower() for c in p["categories"])
            or any(query in t.lower() for t in p["tags"])
            or query in p["excerpt"].lower()
        ]
    else:
        filtered_posts = posts
    
    # Separate featured and latest posts
    featured_posts = [p for p in filtered_posts if p.get("featured")]
    latest_posts = [p for p in filtered_posts if not p.get("featured")]
    
    return render_template(
        'blog.html',
        featured_posts=featured_posts,
        latest_posts=latest_posts,
        query=query,
        subscribed_message=subscribed_message
    )


@app.route("/blogs/<int:post_id>")
def blog_post(post_id):
    """A single blog post."""
    post = next((p for p in posts if p["id"] == post_id), None)
    if post is None:
        return render_template("blog_post_missing.html"), 404

    # neighbours for the prev/next footer, in the order the listing shows them
    idx = posts.index(post)
    prev_post = posts[idx - 1] if idx > 0 else None
    next_post = posts[idx + 1] if idx < len(posts) - 1 else None

    # a couple of related posts by shared category
    related = [
        p for p in posts
        if p["id"] != post_id and set(p.get("categories", [])) & set(post.get("categories", []))
    ][:2]

    return render_template(
        "blog_post.html",
        post=post,
        prev_post=prev_post,
        next_post=next_post,
        related=related,
    )


@app.route('/subscribe', methods=['POST'])
def subscribe():
    """Handle email subscription"""
    email = request.form.get('email', '').strip()
    
    if email:
        # Append to a CSV file (simple storage)
        csv_file = 'subscribers.csv'
        with open(csv_file, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([datetime.utcnow().isoformat(), email])
        
        message = "Thanks for subscribing! 🎉"
    else:
        message = "Please enter a valid email."
    
    # After subscribing, redirect back to /blogs with a message
    return redirect(url_for('blogs', subscribed_message=message))


@app.route('/focus/technical-projects')
def focus_technical_projects():
    """Technical Projects Focus Page"""
    return render_template('focus_technical_projects.html')


@app.route('/focus/community-events')
def focus_community_events():
    """Community Events Focus Page"""
    return render_template('focus_community_events.html')


# ---------------------------------------------------------------------------
# EVENTS - drives /events. Newest first within each list. Same rule as the
# roadmap: never invent a date; use "Date TBA" until one is announced.
# ---------------------------------------------------------------------------
EVENTS_UPCOMING = [
    {
        "title": "FETC 2027",
        "kicker": "Conference",
        "date": "January 26-29, 2027",
        "place": "Orlando, Florida",
        "blurb": "The Future of Education Technology Conference. Our team will "
                 "deliver three sessions on student-led innovation, real-world "
                 "use of AI tools, and supporting technology adoption in schools.",
        "image": "fetc-logo.jpg", "image_alt": "FETC logo", "image_fit": "contain",
        "href": "https://www.fetc.org/", "external": True, "cta": "Visit FETC",
    },
    {
        "title": "AI Philosophy Workshops",
        "kicker": "Workshop series",
        "date": "Date TBA",
        "place": "Mountain View High School",
        "blurb": "Student-run sessions on the ethics and limits of the AI tools "
                 "everyone is already using. Details coming soon.",
    },
]
EVENTS_PAST = [
    {
        "title": "AI & Education Parent Night",
        "kicker": "Second annual",
        "date": "September 29, 2026",
        "place": "Mountain View High School",
        "blurb": "65 parents, four guest speakers from Google, Stanford, MVLA and "
                 "MVHS, and one question: what does AI mean for our students?",
        "image": "events/ai-parent-night/hero.jpg",
        "image_alt": "Panelists on stage at AI & Education Parent Night",
        "href": "/events/ai-parent-night", "cta": "See the full recap",
        "featured": True,
    },
    {
        "title": "AI Parent Night",
        "kicker": "First annual",
        "date": "September 24, 2025",
        "place": "Mountain View High School",
        "blurb": "Our first evening for families on how AI is used in the "
                 "classroom, with a panel of district and school leaders.",
        "image": "ai-parent-night-2025.jpg",
        "image_alt": "Panelists and student moderators at the 2025 AI Parent Night",
        "href": "/blogs/2", "cta": "Read Sean Lin's recap",
    },
]


@app.route('/events')
def events():
    """Events: upcoming and past"""
    return render_template('events.html', upcoming=EVENTS_UPCOMING, past=EVENTS_PAST)


# ---------------------------------------------------------------------------
# AI & EDUCATION PARENT NIGHT (Sept 29, 2026) - drives /events/ai-parent-night.
# Copy is condensed from the interns' recap-video script. Photos are in
# static/images/events/ai-parent-night/, the recap video in static/video/.
# Speaker order matches the panel slide shown at the event.
# ---------------------------------------------------------------------------
AI_PARENT_NIGHT = {
    "speakers": [
        {"name": "Julia Wilkowski", "role": "Head of Learning Science",
         "org": "Google", "photo": "speaker-wilkowski.jpg"},
        {"name": "Isabelle Hau", "role": "Executive Director",
         "org": "Stanford Accelerator for Learning", "photo": "speaker-hau.jpg"},
        {"name": "Bob Fishtrom", "role": "Director of IT Services",
         "org": "MVLA School District", "photo": "speaker-fishtrom.jpg"},
        {"name": "Abigail Dennison", "role": "Teacher",
         "org": "Mountain View High School", "photo": "speaker-dennison.jpg"},
    ],
    "gallery": [
        {"file": "panel-wide", "alt": "The full panel on stage in front of a room of parents", "wide": True},
        {"file": "julia-wilkowski", "alt": "Julia Wilkowski of Google answering a question"},
        {"file": "isabelle-hau", "alt": "Isabelle Hau of the Stanford Accelerator for Learning speaking, seen from the audience"},
        {"file": "intern-speaking", "alt": "A tech intern speaking to the room"},
        {"file": "abigail-dennison", "alt": "Abigail Dennison, an MVHS teacher, speaking on the panel"},
        {"file": "interns-intro", "alt": "Tech interns at the front of the room as the panel begins"},
        {"file": "audience", "alt": "Students in the audience listening to the panel"},
        {"file": "intern-presenting", "alt": "A tech intern presenting survey results"},
        {"file": "after-the-panel", "alt": "Speakers together after the event"},
    ],
}


@app.route('/events/ai-parent-night')
def event_ai_parent_night():
    """AI & Education Parent Night recap"""
    return render_template('event_ai_parent_night.html', event=AI_PARENT_NIGHT)


@app.route('/focus/tech-support')
def focus_tech_support():
    """Tech Support Focus Page"""
    return render_template('focus_tech_support.html')


if __name__ == '__main__':
     app.run(debug=True, host='0.0.0.0', port=8080)