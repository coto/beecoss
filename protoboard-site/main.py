#!/usr/bin/env python

__author__ = 'Rodrigo Augosto (@coto) - coto@protoboard.cl'
__website__ = 'www.protoboard.cl'

# Google App Engine imports.
from google.appengine.api import mail, users
from google.appengine.ext import db

# Python imports
from libs import functions, i18n, languages
import captcha, os, webapp2, jinja2

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class BaseHandler(webapp2.RequestHandler):
    def render_template(self, filename, template_args):
#        print "filename %s" % filename
        template = jinja_environment.get_template(filename)
#        print "template %s" % template
        self.response.out.write(template.render(template_args))

def set_lang_cookie_and_return_dict(self):
    if self.request.get("hl") == "":
        # ask for cookie
        lang_cookie = functions.read_cookie(self, "hl")
        c = i18n.get_country(self)
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
    functions.write_cookie(self, "hl",lang_cookie, "/" )
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
			'captchahtml': chtml,
			'device': functions.get_device(self),
			'lang': set_lang_cookie_and_return_dict(self),
			'path': self.request.path,
		}

        self.render_template("views/contact.html", params)

    def post(self):
        ip = self.request.remote_addr
        now = functions.get_date_time()
        email = self.request.get('email')
        lang = set_lang_cookie_and_return_dict(self)
        subject = self.request.get('subject')
        message = self.request.get('message')
        challenge = self.request.get('recaptcha_challenge_field')
        response  = self.request.get('recaptcha_response_field')
        chtml = captcha.displayhtml(
              public_key = "6Lc3HcMSAAAAAICqorBn6iITHLZMqF08gjzKvshm",
              use_ssl = False,
              error = None)

        cResponse = captcha.submit(
             challenge,
             response.encode('utf-8'),
             "6Lc3HcMSAAAAAAq3AmnzE9t17wkxLU7OlKAKUjX9", ip)

        if not cResponse.is_valid:
            params = {
				'captchahtml': chtml,
				'device': functions.get_device(self),
				'lang': set_lang_cookie_and_return_dict(self),
				'path' : self.request.path,
				'msg': lang["invalid_captcha"],
				'is_error': True,
			}
            #self.response.out.write("chaptcha invalid: " + challenge  + " - " + response)
            self.response.out.write(template.render('views/contact.html', params))
            return

        # valid email address
        if not functions.is_email_valid(email):
            params = {
#				'captchahtml': chtml,
				'device': functions.get_device(self),
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
				country = i18n.get_country(self)
				)
            contactForm.put()

            # Internal
            message_to_admin = mail.EmailMessage()
            message_to_admin.sender = "rodrigo.augosto@gmail.com"
            message_to_admin.subject = "Protoboard - Contact : " + subject
            message_to_admin.to = "rodrigo.augosto@gmail.com"
            message_to_admin.body = 'who: %(who)s \nwhen: %(when)s \nremote_addr: %(remote_addr)s \nCountry: %(country)s \n\n%(message)s' % \
					  {'who': email, "when": str(now), "remote_addr": ip, "country": i18n.get_country(self), "message": message}
            message_to_admin.send()
            params = {
#				'captchahtml': chtml,
				'device': functions.get_device(self),
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
			'device': functions.get_device(self),
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
        now = os.environ['TZ'] +" "+ str(functions.get_date_time())
        user = users.get_current_user()

        if user:
            greeting = ("Welcome, %s! (<a href=\"%s\">sign out</a>), it's %s" %
						(user.nickname(), users.create_logout_url("/author"), now))
        else:
            greeting = ("<a href=\"%s\">Sign in or register</a>, it's %s" %
						(users.create_login_url("/author"), now))

        params = {
			'device': functions.get_device(self),
			'ip': ip,
			'greeting': greeting,
		}

        self.render_template("views/author.html", params)

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/about', MainHandler),
    ('/[c|C]ontact', ContactHandler),
    ('/author', AuthorHandler),
], debug=True)
