"""
MVHS Tech Internship Main Website
"""

import os
import smtplib
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


@app.route("/blog")
def blog():
    return render_template("blog.html")


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