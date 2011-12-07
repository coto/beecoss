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
import webapp2
import os
# specify the name of your settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'myapp.settings'

import django.core.handlers.wsgi
app = django.core.handlers.wsgi.WSGIHandler()

class MainPage(webapp2.RequestHandler):
  def get(self):
      self.response.headers['Content-Type'] = 'text/plain'
      self.response.out.write('WWorking on this sites!!!')

app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)