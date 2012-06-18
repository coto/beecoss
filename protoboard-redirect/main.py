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
import webapp2, re

#test : http://7.protoboard-site.appspot.com/

class MainHandler(webapp2.RequestHandler):
    def get(self):

#        self.response.write(self.request.url)

        if re.search('protoboard.cl', str(self.request.url)):
            new_url = re.sub('protoboard.cl', 'beecoss.com', str(self.request.url))
#            self.response.write(new_url)
            self.redirect(new_url)
        elif re.search('protoboard', str(self.request.url)):
            new_url = re.sub('protoboard', 'beecoss', str(self.request.url))
            self.redirect(new_url)
        else:
            self.response.write("This domain had moved to <a href='http://beecoss.com'>Beecoss.com</a>.")


app = webapp2.WSGIApplication([
    ('/.*', MainHandler),
], debug=True)
