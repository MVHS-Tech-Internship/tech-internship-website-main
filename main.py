"""
MVHS Tech Internship Main Website
"""

import os
import csv
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')


@app.route('/')
def index():
    """Home Page"""
    return render_template('index.html')


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
        
        # Send the email to mvhs.tech24@gmail.com using SMTP
        send_email("mvhs.tech24@gmail.com", subject, body)
        
        # Redirect to success page
        return redirect(url_for('contact_success'))
    
    return render_template('contact.html')


@app.route('/contact/success')
def contact_success():
    """Contact form success page"""
    return render_template('contact_success.html')


@app.route('/donations')
def donations():
    """Donations Page"""
    return render_template('donations.html')


@app.route('/merch')
def merch():
    """Merch Page"""
    return render_template('merch.html')


@app.route('/meet-the-team')
def meet_the_team():
    """Meet the Team Page"""
    return render_template('meet_the_team.html')


# Blog posts data (in-memory)
posts = [
    {
        "id": 1,
        "title": "How AI is Transforming Student Learning at MVHS",
        "excerpt": "We explore how artificial intelligence tools are being integrated into classrooms, the benefits we've observed, and the challenges we're working to address. This article shares real experiences from students and teachers using AI-powered study platforms.",
        "author": "Sarah Chen",
        "date": "January 15, 2026",
        "read_time": "5 min read",
        "categories": ["Education"],
        "tags": ["Education", "AI", "Student Life"],
        "featured": True
    },
    {
        "id": 2,
        "title": "Building Our First Student-Led Tech Support Platform",
        "excerpt": "A behind-the-scenes look at how our interns designed and built a peer-to-peer tech support system. Learn about the development process, user testing, and the impact it's had on helping students solve technology challenges independently.",
        "author": "Alex Rodriguez",
        "date": "January 10, 2026",
        "read_time": "7 min read",
        "categories": ["Technology"],
        "tags": ["Technology", "Student Life"],
        "featured": True
    },
    {
        "id": 3,
        "title": "Understanding AI Ethics in Education",
        "excerpt": "Exploring the ethical considerations when implementing AI tools in educational settings and how students can engage thoughtfully with these technologies.",
        "author": "Maria Garcia",
        "date": "January 8, 2026",
        "read_time": "4 min read",
        "categories": ["AI"],
        "tags": ["AI", "Education"],
        "featured": False
    },
    {
        "id": 4,
        "title": "A Day in the Life of a Tech Intern",
        "excerpt": "Follow along as we document a typical day for our interns, from morning meetings to afternoon coding sessions and evening events.",
        "author": "James Park",
        "date": "January 5, 2026",
        "read_time": "3 min read",
        "categories": ["Student Life"],
        "tags": ["Student Life"],
        "featured": False
    },
    {
        "id": 5,
        "title": "Workshop Recap: AI Tools for Students",
        "excerpt": "Highlights from our recent workshop where students learned about practical AI applications for studying, writing, and research.",
        "author": "Emma Thompson",
        "date": "January 3, 2026",
        "read_time": "5 min read",
        "categories": ["Education"],
        "tags": ["Education", "AI"],
        "featured": False
    },
    {
        "id": 6,
        "title": "Open Source Contributions from MVHS Students",
        "excerpt": "Celebrating the open source projects our interns have contributed to and the impact they're making in the developer community.",
        "author": "David Kim",
        "date": "December 28, 2025",
        "read_time": "6 min read",
        "categories": ["Technology"],
        "tags": ["Technology"],
        "featured": False
    },
    {
        "id": 7,
        "title": "Evaluating AI Study Tools: A Student Perspective",
        "excerpt": "Our interns share their honest reviews of popular AI-powered study platforms, what works, what doesn't, and recommendations for students.",
        "author": "Lisa Wang",
        "date": "December 25, 2025",
        "read_time": "8 min read",
        "categories": ["AI"],
        "tags": ["AI", "Education", "Student Life"],
        "featured": False
    },
    {
        "id": 8,
        "title": "Building Community Through Tech Events",
        "excerpt": "How our program uses technology events and workshops to bring students together and create a supportive learning community.",
        "author": "Ryan Patel",
        "date": "December 20, 2025",
        "read_time": "4 min read",
        "categories": ["Student Life"],
        "tags": ["Student Life", "Education"],
        "featured": False
    }
]


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