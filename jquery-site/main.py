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

import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util, template

class BaseHandler(webapp.RequestHandler):
    def render_template(self, filename, **template_args):
        path = os.path.join(os.path.dirname(__file__), filename)
        self.response.out.write(template.render(path, template_args))

class MainHandler(BaseHandler):
    def get(self):

        self.render_template('index.html', name=self.request.get('name'))



def main():
    application = webapp.WSGIApplication([
			('/', MainHandler),
		], debug=True)

    util.run_wsgi_app(application)

if __name__ == '__main__':
    main()
