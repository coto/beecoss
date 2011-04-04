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

		mail.send_mail(sender="Example.com Support <rodrigo.augosto@gmail.com>",
		              to="Albert Johnson <rodrigo.augosto@gmail.com>",
		              subject="Your account has been approved",
		              body="""
		Dear Albert:

		Your example.com account has been approved.  You can now visit
		http://www.example.com/ and sign in using your Google Account to
		access new features.

		Please let us know if you have any questions.

		The example.com Team
		""")
		self.redirect("/contact")


class MainHandler(webapp.RequestHandler):
    def get(self):

        url = "users.create_login_url(self.request.uri)"
        url_linktext = 'Login'

        template_values = {
            'url': url,
            'url_linktext': url_linktext
        }

        path = os.path.join(os.path.dirname(__file__), 'views/home.html')
        #self.response.out.write("path:" +path)
        self.response.out.write(template.render(path, template_values))

class Author2Handler(webapp.RequestHandler):
	def get(self):
		now = datetime.datetime.now()
		user = users.get_current_user()
		uastring = self.request.headers.get('user_agent')
		if "Mobile" in uastring and "Safari" in uastring:
			device = "iphone / ipod"
		if user:
			greeting = ("Welcome, %s! (<a href=\"%s\">sign out</a>)" %
						(user.nickname(), users.create_logout_url("/author")))
		else:
			greeting = ("<a href=\"%s\">Sign in or register</a>." %
						users.create_login_url("/author"))

		footer = ("<br>User Agent: %s <br><br> Rodrigo Augosto C. a.k.a. Coto %s" % 
				(uastring, now))
				
		self.response.out.write("<html><body>%s<footer>%s</footer></body></html>" % 
								(greeting, footer))
								
class AuthorHandler(webapp.RequestHandler):
	def get(self):
		
		self.response.headers['Content-Type'] = 'text/html'
		ua = self.request.user_agent
		uastring = self.request.headers.get('user_agent')
		
		if "Mobile" in uastring:
			device = "mobile"
		else:
			device = "desktop"
			
		
		template_values = {
			'device': device,
			'ua': ua,
			'uastring': uastring,
		}
		mobileDevice = "true"

		if mobileDevice:
			self.response.out.write(template.render('views/author.html', template_values))
		else:
			self.response.out.write(template.render('views/author.html', template_values))

								
def main():
    application = webapp.WSGIApplication([
			('/', MainHandler),
			('/[c|C]ontact', Contact),
			('/author', AuthorHandler)
		], debug=True)
		
    util.run_wsgi_app(application)

	# working with wsgiref 
	#import wsgiref.handlers
	#wsgiref.handlers.CGIHandler().run(application)

if __name__ == '__main__':
    main()
