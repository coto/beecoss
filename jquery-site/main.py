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

import os, webapp2, jinja2

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


class BaseHandler(webapp2.RequestHandler):
    def render_template(self, filename, template_args):
        template = jinja_environment.get_template(filename)
        self.response.out.write(template.render(template_args))

class MainHandler(BaseHandler):
    def get(self):
        template_values = {
            'greetings': "as",
            'url': "http",
            'url_linktext': "text link",
        }

        self.render_template('index.html', template_values)

app = webapp2.WSGIApplication([('/', MainHandler)], debug = True)