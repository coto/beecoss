#!/usr/bin/env python

import os

# Google App Engine imports.
from google.appengine.ext import webapp
from google.appengine.ext.webapp \
	import util, template

class MobileHandler(webapp.RequestHandler):
    def get(self):

        path = os.path.join(os.path.dirname(__file__), 'sandbox/frameworkmobile/main.html')
        self.response.out.write(template.render(path, {}))


def main():
    application = webapp.WSGIApplication([
			('/sandbox/frameworkmobile', MobileHandler),
		], debug=True)
		
    util.run_wsgi_app(application)

if __name__ == '__main__':
    main()
