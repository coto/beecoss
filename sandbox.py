#!/usr/bin/env python

import os, webapp2, jinja2

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


class BaseHandler(webapp2.RequestHandler):
    def render_template(self, filename, template_args):
#        print "filename %s" % filename
        template = jinja_environment.get_template(filename)
#        print "template %s" % template
        self.response.out.write(template.render(template_args))

class MobileHandler(BaseHandler):
    def get(self):
        params = {
            'device': 'name',
        }
        self.render_template('views/cotow.html', params)

app = webapp2.WSGIApplication([
    ('/sandbox/cotow', MobileHandler),
], debug=True)
