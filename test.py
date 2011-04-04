#!/usr/bin/env python

import os
import datetime

# Google App Engine imports.
from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp \
	import util, template

class MobileHandler(webapp.RequestHandler):
    def get(self):

        path = os.path.join(os.path.dirname(__file__), 'views/mobile.html')
        self.response.out.write(template.render(path, {}))

class jQMobileHandler(webapp.RequestHandler):
    def get(self):

        path = os.path.join(os.path.dirname(__file__), 'views/jquerymobile.html')
        self.response.out.write(template.render(path, {}))

def main():
    application = webapp.WSGIApplication([
			('/test/mobile', MobileHandler),
			('/test/jquerymobile', jQMobileHandler),
		], debug=True)
		
    util.run_wsgi_app(application)

	# working with wsgiref 
	#import wsgiref.handlers
	#wsgiref.handlers.CGIHandler().run(application)

if __name__ == '__main__':
    main()
