#!/usr/bin/env python2.5
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

import datetime, re, captcha, os

# Google App Engine imports.
from google.appengine.api import mail
from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp \
	import util, template

def isAddressValid(email):
	if len(email) > 7:
		if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", email) != None:
			return 1
	return 0
def get_device(self):
	uastring = self.request.user_agent
	if "Mobile" in uastring and "Safari" in uastring:
		device = "mobile"
	else:
		device = "desktop"

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


	return "desktop"

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

class ContactHandler(webapp.RequestHandler):
	def get(self):
		path = self.request.path
		chtml = captcha.displayhtml(
		  public_key = "6Lc3HcMSAAAAAICqorBn6iITHLZMqF08gjzKvshm",
		  use_ssl = False,
		  error = None)

		params = {
			'device': get_device(self),
			'captchahtml': chtml,
			'path': path,
		}
		self.response.out.write(
			template.render('views/contact.html', params))

	def post(self):
		ip = self.request.remote_addr
		now = datetime.datetime.now()
		who = self.request.get('who')
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
						 "6Lc3HcMSAAAAAAq3AmnzE9t17wkxLU7OlKAKUjX9",
						 ip)
		if not cResponse.is_valid:
			params = {
				'device': get_device(self),
				'path' : self.request.path,
				'msg': "invalid captcha",
				'is_error': True,
                'captchahtml': chtml,
			}
			self.response.out.write(
				template.render('views/contact.html', params))
			return
		# valid email address
		if not isAddressValid(who):
			params = {
				'device': get_device(self),
				'path' : self.request.path,
				'msg': "invalid_email_address",
				'is_error': False,
                'captchahtml': chtml,
			}
			self.response.out.write(
				template.render('views/contact.html', params))

		else:
			contactForm = ContactForm(
				who = who,
				subject = subject,
				message = message,
				remote_addr = ip
				)
			contactForm.put()

			# Internal
			message_to_admin = mail.EmailMessage()
			message_to_admin.sender = "rodrigo.augosto@gmail.com"
			message_to_admin.subject = "Protoboard - Contact : ", subject
			message_to_admin.to = "rodrigo.augosto@gmail.com"
			message_to_admin.body = '{\n\t"who": "%(who)s", \n\t"when": "%(when)s", \n\t"remote_addr": "%(remote_addr)s", \n\t"message": "%(message)s"\n},' % \
					  {'who': who, "when": str(now), "remote_addr": ip, "message": message}
			message_to_admin.send()

			params = {
				'device': get_device(self),
				'path' : self.request.path,
				'msg': "successfuly sent",
				'is_error': False,
                'captchahtml': chtml,
			}
			self.response.out.write(
				template.render('views/contact.html', params))


class MainHandler(webapp.RequestHandler):
	def get(self):
		path = self.request.path

		if path == "/":
			path = "/home"

		params = {
			'device': get_device(self),
			'path': path
		}

		view = os.path.join('views%s.html' % (path))
		self.response.out.write(
			template.render(view, params))

class AuthorHandler(webapp.RequestHandler):
	def get(self):

		self.response.headers['Content-Type'] = 'text/html'
		uastring = self.request.user_agent
		ip = self.request.remote_addr
		now = datetime.datetime.now()
		user = users.get_current_user()

		if user:
			greeting = ("Welcome, %s! (<a href=\"%s\">sign out</a>), it's %s" %
						(user.nickname(), users.create_logout_url("/author"), now))
		else:
			greeting = ("<a href=\"%s\">Sign in or register</a>, it's %s" %
						(users.create_login_url("/author"), now))

		if "Mobile" in uastring and "Safari" in uastring:
			device = "mobile"
		else:
			device = "desktop"

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

		template_values = {
			'device': device,
			'uastring': uastring,
			'ip': ip,
			'greeting': greeting,
			'browser': browser,
		}

		mobileDevice = "true"
		if mobileDevice:
			self.response.out.write(template.render('views/author.html', template_values))
		else:
			self.response.out.write(template.render('views/author.html', template_values))


def main():
	application = webapp.WSGIApplication([
			('/', MainHandler),
			('/blog', MainHandler),
			('/about', MainHandler),
			('/[c|C]ontact', ContactHandler),
			('/author', AuthorHandler)
		], debug=True)

	util.run_wsgi_app(application)

	# working with wsgiref
	#import wsgiref.handlers
	#wsgiref.handlers.CGIHandler().run(application)

if __name__ == '__main__':
	main()
