
__author__ = 'coto'
__website__ = 'www.protoboard.cl'

import os, re, logging, hashlib, Cookie
from datetime import datetime, timedelta
from google.appengine.runtime import apiproxy_errors
from google.appengine.ext.db import BadValueError
from google.appengine.api \
    import mail
from google.appengine.ext \
    import db

def encrypt(plaintext, salt="", sha="512"):
    """ Returns the encrypted hexdigest of a plaintext and salt"""
    if sha == "1":
        phrase = hashlib.sha1()
    elif sha == "256":
        phrase = hashlib.sha256()
    else:
        phrase = hashlib.sha512()
    phrase.update("%s@%s" % (plaintext, salt))
    return phrase.hexdigest()

def write_cookie(self, COOKIE_NAME, COOKIE_VALUE, path, expires=7200):
    """
    Write a cookie
    @path = could be a self.request.path to set a specific path
    @expires = seconds (integer) to expire the cookie, by default 2 hours ()
    expires = 7200 # 2 hours
    expires = 1209600 # 2 weeks
    expires = 2629743 # 1 month
    """
    time_expire = datetime.now() + timedelta(seconds=expires) # days, seconds, then other fields.
    time_expire = time_expire.strftime("%a, %d-%b-%Y %H:%M:%S GMT")
#    print time_expire

    self.response.headers.add_header('Set-Cookie', COOKIE_NAME+'='+COOKIE_VALUE+'; expires='+str(time_expire)+'; path='+path+'; HttpOnly')
    return

def read_cookie(self, name):
    """
    Use: cook.read(self, COOKIE_NAME)
    """
    string_cookie = os.environ.get('HTTP_COOKIE', '')
    self.cookie = Cookie.SimpleCookie()
    self.cookie.load(string_cookie)
    value = None
    if self.cookie.get(name):
        value  = self.cookie[name].value

    return value
    # Old Way
#    value = self.request.cookies.get(name)

def error_report(self, body, folk="anonymous"):
    """
    Reports errors sending emails
    """
    emailer_subject = "Error Reporting"
    emailer_to = "coto@protoboard.cl"
    emailer_html = ""
    emailer_body = 'who: %(folk)s \nwhen: %(when)s \nbrowser: %(browser)s \nremote_addr: %(remote_addr)s \n\n'  % \
              {'folk': folk, "when": get_date_time(), "browser": self.request.user_agent, "remote_addr": self.request.remote_addr }
    emailer_body += body

    # Set logging
    logging.error(emailer_body)
    # Send email
    send_email(emailer_subject, emailer_to, emailer_html, emailer_body)
    return

def get_date_time(format="%Y-%m-%d %H:%M:%S", UTC_OFFSET=3):
    """
    Get date and time in UTC for Chile with a specific format
    """
    local_datetime = datetime.now()
    now = local_datetime - timedelta(hours=UTC_OFFSET)
    if format != "datetimeProperty":
        now = now.strftime(format)
#    now = datetime.fromtimestamp(1321925140.78)
    return now

def is_email_valid(email):
    if len(email) > 7:
        if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", email) != None:
            return 1
    return 0
    
def is_alphanumeric(field):
    if re.match("^\w+$", field) is not None:
        return 1
    return 0

def get_device(self):
    uastring = self.request.user_agent
    if "Mobile" in uastring and "Safari" in uastring:
        kind = "mobile"
    else:
        kind = "desktop"

    if "MSIE" in uastring:
        browser = "Explorer"
    elif "Firefox" in uastring:
        browser = "Firefox"
    elif "Presto" in uastring:
        browser = "Opera"
    elif "Android" in uastring and "AppleWebKit" in uastring:
        browser = "Chrome for andriod"
    elif "iPhone" in uastring and "AppleWebKit" in uastring:
        browser = "Safari for iPhone"
    elif "iPod" in uastring and "AppleWebKit" in uastring:
        browser = "Safari for iPod"
    elif "iPad" in uastring and "AppleWebKit" in uastring:
        browser = "Safari for iPad"
    elif "Chrome" in uastring:
        browser = "Chrome"
    elif "AppleWebKit" in uastring:
        browser = "Safari"
    else:
        browser = "unknow"

    device = {
		"kind": kind,
		"browser": browser,
		"uastring": uastring
	}

    return device

class EmailLog(db.Model):
    sender = db.EmailProperty(
        required=True)
    mailto = db.StringProperty(
        required=True)
    subject = db.StringProperty(
        required=True)
    html = db.TextProperty()
    body = db.TextProperty()
    when = db.DateTimeProperty()

def send_email(subject, mailto, text_html, body, sender="coto@protoboard.cl"):
    """
    Central to Send email
    """
    subject = "Protoboard Contact: " + subject
    try:
        emailLog = EmailLog(
            sender = sender,
            mailto = mailto,
            subject = subject,
            html = text_html ,
            body = body,
            when = get_date_time("datetimeProperty")
        )
        emailLog.put()
    except BadValueError:
        logging.error("Emailer | error saving in DataStore the emailLog")

    try:
        message = mail.EmailMessage()
        message.subject = subject
        message.sender = sender
        message.to = mailto
        if text_html != "":
            message.html = text_html
        else:
            message.body = body
        message.send()
    except apiproxy_errors.OverQuotaError, message:
        logging.error("Emailer | There was a apiproxy_errors sending %s" % message.subject)
    except:
        logging.error("Problem sending email with subject: %s" % subject)