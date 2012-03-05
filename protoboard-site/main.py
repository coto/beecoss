#!/usr/bin/env python
##
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# Google App Engine imports.
from google.appengine.api import mail
from google.appengine.api import users
from google.appengine.api import urlfetch
from google.appengine.ext import db

# Python imports
from datetime import datetime, timedelta
import re, captcha, languages
import os, webapp2, jinja2

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class BaseHandler(webapp2.RequestHandler):
    def render_template(self, filename, template_args):
#        print "filename %s" % filename
        template = jinja_environment.get_template(filename)
#        print "template %s" % template
        self.response.out.write(template.render(template_args))

def get_date_time(UTC_OFFSET=3, format="%Y-%m-%d %H:%M:%S"):
    """
    Get date and time in UTC for Chile with a specific format
    """
    local_datetime = datetime.now()
    now = local_datetime - timedelta(hours=UTC_OFFSET)
    now = now.strftime(format)
#    now = datetime.fromtimestamp(1321925140.78)
    return now

def get_country(self):
    country = urlfetch.fetch("http://geoip.wtanaka.com/cc/"+self.request.remote_addr).content
    return country

def isAddressValid(email):
    if len(email) > 7:
        if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", email) != None:
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

def set_lang_cookie_and_return_dict(self):
    if self.request.get("hl") == "":
        # ask for cookie
        lang_cookie = self.request.cookies.get("hl")
        c = get_country(self)
        if not lang_cookie:
            if c == "ca" or c == "uk" or c == "us" or c == "eu" or c == "de" \
               or c == "gb" or c == "jp" or c == "cn" or c == "in" or c == "ru" \
               or c == "no" or c == "au" or c == "nz" or c == "se" or c == "dk" or c == "br" or c == "pt":
                lang_cookie = "en"
            else:
                #TODO: Is Necessary to change to Spanish
                lang_cookie = "en"
    else:
        # set cookie to en
        lang_cookie = self.request.get("hl")

    self.response.headers.add_header("Set-Cookie", str("hl=" + lang_cookie + ";"))
    lang = {
	  'en': languages.en,
	  'es': languages.es,
	}[lang_cookie]
    return lang

class ContactForm(db.Model):
    when = db.DateTimeProperty(
		auto_now_add=True)
    who = db.StringProperty(
		required=True)
    subject = db.StringProperty(
		required=True)
    message = db.StringProperty(
		required=True)
    remote_addr = db.StringProperty()
    country = db.StringProperty()

class ContactHandler(BaseHandler):
    def get(self):
        chtml = captcha.displayhtml(
              public_key = "6Lc3HcMSAAAAAICqorBn6iITHLZMqF08gjzKvshm",
              use_ssl = False,
              error = None)

        params = {
#			'captchahtml': chtml,
			'device': get_device(self),
			'lang': set_lang_cookie_and_return_dict(self),
			'path': self.request.path,
		}

        self.render_template("views/contact.html", params)

    def post(self):
        ip = self.request.remote_addr
        now = get_date_time()
        email = self.request.get('email')
        lang = set_lang_cookie_and_return_dict(self)
        subject = self.request.get('subject')
        message = self.request.get('message')
#        challenge = self.request.get('recaptcha_challenge_field')
#        response  = self.request.get('recaptcha_response_field')
#        chtml = captcha.displayhtml(
#              public_key = "6Lc3HcMSAAAAAICqorBn6iITHLZMqF08gjzKvshm",
#              use_ssl = False,
#              error = None)

#        cResponse = captcha.submit(
#             challenge,
#             response.encode('utf-8'),
#             "6Lc3HcMSAAAAAAq3AmnzE9t17wkxLU7OlKAKUjX9", ip)
#
#        if not cResponse.is_valid:
#            params = {
#				'captchahtml': chtml,
#				'device': get_device(self),
#				'lang': set_lang_cookie_and_return_dict(self),
#				'path' : self.request.path,
#				'msg': lang["invalid_captcha"],
#				'is_error': True,
#			}
#            #self.response.out.write("chaptcha invalid: " + challenge  + " - " + response)
#            self.response.out.write(template.render('views/contact.html', params))
#            return

        # valid email address
        if not isAddressValid(email):
            params = {
#				'captchahtml': chtml,
				'device': get_device(self),
				'lang': set_lang_cookie_and_return_dict(self),
				'path' : self.request.path,
				'msg': lang["invalid_email_address"],
				'is_error': True,
			}
            #self.response.out.write("is not a valid email: " + email)
            self.render_template("views/contact.html", params)
        else:
            contactForm = ContactForm(
				who = email,
				subject = subject,
				message = message,
				remote_addr = ip,
				country = get_country(self)
				)
            contactForm.put()

            # Internal
            message_to_admin = mail.EmailMessage()
            message_to_admin.sender = "rodrigo.augosto@gmail.com"
            message_to_admin.subject = "Protoboard - Contact : " + subject
            message_to_admin.to = "rodrigo.augosto@gmail.com"
            message_to_admin.body = 'who: %(who)s \nwhen: %(when)s \nremote_addr: %(remote_addr)s \nCountry: %(country)s \n\n%(message)s' % \
					  {'who': email, "when": str(now), "remote_addr": ip, "country": get_country(self), "message": message}
            message_to_admin.send()
            params = {
#				'captchahtml': chtml,
				'device': get_device(self),
				'lang': set_lang_cookie_and_return_dict(self),
				'path' : self.request.path,
				'msg': lang["successfuly_sent"],
				'is_error': False,
			}
            self.render_template("views/contact.html", params)

class MainHandler(BaseHandler):
    def get(self):
        path = self.request.path
        if path == "/":
            path = "/home"

        params = {
			'device': get_device(self),
            'lang': set_lang_cookie_and_return_dict(self),
			'path': path,
		}

        view = os.path.join("views%s.html" % (path))
        self.render_template(view, params)

class AuthorHandler(BaseHandler):
    def get(self):
        self.response.headers['Content-Type'] = "text/html"
#        self.response.headers['Content-Type'] = "text/plain"
        ip = self.request.remote_addr
        now = os.environ['TZ'] +" "+ str(get_date_time())
        user = users.get_current_user()

        if user:
            greeting = ("Welcome, %s! (<a href=\"%s\">sign out</a>), it's %s" %
						(user.nickname(), users.create_logout_url("/author"), now))
        else:
            greeting = ("<a href=\"%s\">Sign in or register</a>, it's %s" %
						(users.create_login_url("/author"), now))

        params = {
			'device': get_device(self),
			'ip': ip,
			'greeting': greeting,
		}

        self.render_template("views/author.html", params)

class WidgetHandler(BaseHandler):
    def get(self):
        chtml = captcha.displayhtml(
            public_key = "6Lc3HcMSAAAAAICqorBn6iITHLZMqF08gjzKvshm",
            use_ssl = False,
            error = None)

        params = {
            #			'captchahtml': chtml,
            'device': get_device(self),
            'lang': set_lang_cookie_and_return_dict(self),
            'path': self.request.path,
            }

        self.render_template("views/widget.html", params)

    def post(self):
        ip = self.request.remote_addr
        now = get_date_time()
        email = self.request.get('email')
        lang = set_lang_cookie_and_return_dict(self)
        subject = self.request.get('subject')
        message = self.request.get('message')
        #        challenge = self.request.get('recaptcha_challenge_field')
        #        response  = self.request.get('recaptcha_response_field')
        #        chtml = captcha.displayhtml(
        #              public_key = "6Lc3HcMSAAAAAICqorBn6iITHLZMqF08gjzKvshm",
        #              use_ssl = False,
        #              error = None)

        #        cResponse = captcha.submit(
        #             challenge,
        #             response.encode('utf-8'),
        #             "6Lc3HcMSAAAAAAq3AmnzE9t17wkxLU7OlKAKUjX9", ip)
        #
        #        if not cResponse.is_valid:
        #            params = {
        #				'captchahtml': chtml,
        #				'device': get_device(self),
        #				'lang': set_lang_cookie_and_return_dict(self),
        #				'path' : self.request.path,
        #				'msg': lang["invalid_captcha"],
        #				'is_error': True,
        #			}
        #            #self.response.out.write("chaptcha invalid: " + challenge  + " - " + response)
        #            self.response.out.write(template.render('views/contact.html', params))
        #            return

        # valid email address
        if not isAddressValid(email):
            params = {
                #				'captchahtml': chtml,
                'device': get_device(self),
                'lang': set_lang_cookie_and_return_dict(self),
                'path' : self.request.path,
                'msg': lang["invalid_email_address"],
                'is_error': True,
                }
            #self.response.out.write("is not a valid email: " + email)
            self.render_template("views/widget.html", params)
        else:
            contactForm = ContactForm(
                who = email,
                subject = subject,
                message = message,
                remote_addr = ip,
                country = get_country(self)
            )
            contactForm.put()

            # Internal
            message_to_admin = mail.EmailMessage()
            message_to_admin.sender = "rodrigo.augosto@gmail.com"
            message_to_admin.subject = "Protoboard - Contact : " + subject
            message_to_admin.to = "rodrigo.augosto@gmail.com"
            message_to_admin.body = 'who: %(who)s \nwhen: %(when)s \nremote_addr: %(remote_addr)s \nCountry: %(country)s \n\n%(message)s' %\
                                    {'who': email, "when": str(now), "remote_addr": ip, "country": get_country(self), "message": message}
            message_to_admin.send()
            params = {
                #				'captchahtml': chtml,
                'device': get_device(self),
                'lang': set_lang_cookie_and_return_dict(self),
                'path' : self.request.path,
                'msg': lang["successfuly_sent"],
                'is_error': False,
                }
            self.render_template("views/widget.html", params)

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/blog', MainHandler),
    ('/about', MainHandler),
    ('/[c|C]ontact', ContactHandler),
    ('/author', AuthorHandler),
    ('/widget', WidgetHandler),
], debug=True)
