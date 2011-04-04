#       Redistribution and use in source and binary forms, with or without
#       modification, are permitted provided that the following conditions are
#       met:
#       
#       * Redistributions of source code must retain the above copyright
#         notice, this list of conditions and the following disclaimer.
#       * Redistributions in binary form must reproduce the above
#         copyright notice, this list of conditions and the following disclaimer
#         in the documentation and/or other materials provided with the
#         distribution.
#       * Neither the name of the  nor the names of its
#         contributors may be used to endorse or promote products derived from
#         this software without specific prior written permission.
#       
#       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
#       "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
#       LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
#       A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
#       OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
#       SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
#       LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
#       DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
#       THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
#       (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
#       OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#!/usr/bin/env python

import os
import datetime

# Google App Engine imports.
from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp \
	import util, template
	
class ContactForm(db.Model):
	when = db.DateTimeProperty(
				auto_now_add=True)
	who = db.StringProperty(
				required=True)
	subject = db.StringProperty(
				required=True)
	message = db.StringProperty(
				required=True)

class Contact(webapp.RequestHandler):
	def get(self):

		path = os.path.join(os.path.dirname(__file__), 'views/contact.html')
		#self.response.out.write("path:" +path)
		self.response.out.write(template.render(path, {}))

	def post(self):
		contactForm = ContactForm(
			who = self.request.get('who'),
			subject = self.request.get('subject'),
			message = self.request.get('message')
			)
		contactForm.put()
		#message = mail.EmailMessage(sender="Example.com Support <rodrigo.augosto@gmail.com>",
		 #                           subject="Your account has been approved")

		#message.to = "Coto <rodrigo.augosto@gmail.com>"
		#message.body = """
		#Dear Albert:

		#Your example.com account has been approved.  You can now visit
		#http://www.example.com/ and sign in using your Google Account to
		#access new features.

		#Please let us know if you have any questions.

		#The example.com Team
		#"""

		#message.send()

		#mail.send_mail(sender="Example.com Support <rodrigo.augosto@gmail.com>",
		#              to="Albert Johnson <rodrigo.augosto@gmail.com>",
		#              subject="Your account has been approved",
		#              body="""
		#Dear Albert:

		#Your example.com account has been approved.  You can now visit
		#http://www.example.com/ and sign in using your Google Account to
		#access new features.

		#Please let us know if you have any questions.

		#The example.com Team
		#""")
		self.redirect("/contact")


class MainHandler(webapp.RequestHandler):
	def get(self):
		uastring = self.request.user_agent
		ip = self.request.remote_addr
		now = datetime.datetime.now()
		user = users.get_current_user()
		path = self.request.path

		if path == "/":
			path = "/home"
		
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
			'device': 'desktop',
			'uastring': uastring,
			'ip': ip,
			'browser': browser,
			'path' : path,
		}

		path = os.path.join(os.path.dirname(__file__), 'views%s.html' % (path))
		#self.response.out.write("path:" +path)
		self.response.out.write(template.render(path, template_values))
		
	def post(self):
		contactForm = ContactForm(
			who = self.request.get('who'),
			subject = self.request.get('subject'),
			message = self.request.get('message')
			)
		contactForm.put()
		self.redirect("/contact")
			
			
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
			('/[c|C]ontact', MainHandler),
			('/author', AuthorHandler)
		], debug=True)
		
    util.run_wsgi_app(application)

	# working with wsgiref 
	#import wsgiref.handlers
	#wsgiref.handlers.CGIHandler().run(application)

if __name__ == '__main__':
    main()
