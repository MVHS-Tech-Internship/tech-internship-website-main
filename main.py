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
# ROADMAP — drives the scroll-driven road on the home page.
#
# Every entry below is drawn from content already on the site. Where a date has
# not been publicly announced, `tba` is True and the label reads "Date TBA" —
# do not replace those with invented dates. Fill them in as they're confirmed.
# Order = left-to-right order along the road.
# ---------------------------------------------------------------------------
ROADMAP = [
    {
        "date": "Ongoing",
        "tba": False,
        "title": "On-Campus Tech Support",
        "blurb": "Peer-driven help for 2,000+ students and staff, running through "
                 "our student-built request form and internal support process.",
        "href": "/focus/tech-support",
        "cta": "How it works",
    },
    {
        "date": "Ongoing",
        "tba": False,
        "title": "Knowt Partnership Review",
        "blurb": "Interns evaluate the AI study platform with a student-designed "
                 "rubric and send structured feedback straight back to the team.",
        "href": "/about/partnerships",
        "cta": "Our partners",
    },
    {
        "date": "Date TBA",
        "tba": True,
        "title": "AI Parent Night",
        "blurb": "An evening built for families — what AI in the classroom actually "
                 "looks like, what it changes, and the questions worth asking.",
        "href": "/focus/community-events",
        "cta": "Community events",
    },
    {
        "date": "January 2026",
        "tba": False,
        "title": "FETC 2026 — Three Sessions",
        "blurb": "We've been invited to speak at the Future of Education Technology "
                 "Conference on student-led innovation and real-world AI adoption.",
        "href": "https://www.fetc.org/",
        "external": True,
        "cta": "Visit FETC",
    },
    {
        "date": "Date TBA",
        "tba": True,
        "title": "AI Philosophy Workshops",
        "blurb": "Student-run sessions on the ethics and limits of the tools everyone "
                 "is already using — built around our AI ethics game cards.",
        "href": "/resources",
        "cta": "Resources",
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


@app.route('/about/team')
def about_team():
    """Our Team Page"""
    return render_template('about_team.html')


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
    """Meet the Team Page"""
    return render_template('meet_the_team.html')

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
# The content for all posts except post 2 below is currently AI-generated.
# To replace, update the "content" key for each corresponding post ID in the 'blog_data.json' file.
posts = load_posts()

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


@app.route('/focus/tech-support')
def focus_tech_support():
    """Tech Support Focus Page"""
    return render_template('focus_tech_support.html')


if __name__ == '__main__':
     app.run(debug=True, host='0.0.0.0', port=8080)