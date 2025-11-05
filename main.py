"""
MVHS Tech Internship Main Website
"""

from flask import Flask, render_template
import os

app = Flask(__name__)


@app.route('/')
def index():
    """Home Page"""
    return render_template('index.html')


@app.route('/about')
def about():
    """About Us Page"""
    return render_template('about.html')


@app.route('/news')
def news():
    """News & Media Page"""
    return render_template('news.html')


@app.route('/resources')
def resources():
    """Home Page"""
    return render_template('resources.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact Us Page"""
    return render_template('contact.html')


@app.route('/support')
def support():
    """Support Us Page"""
    return render_template('support.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)