#!/usr/bin/env python

# Google App Engine imports.
import wsgiref.handlers
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp \
	import template
	
class Vote(db.Model):
	message = db.StringProperty(
				required=True)
	when = db.DateTimeProperty(
				auto_now_add=True)

class Poll(webapp.RequestHandler):
	def get(self):
		votes = db.GqlQuery('SELECT * FROM Vote')
		values = {
			'votes': votes
		}
		self.response.out.write(
			template.render('views/poll.html', values))
	def post(self):
		vote = Vote(
			message=self.request.get('message')
			)
		vote.put()
		self.redirect("/poll")
		
		
def main():
	app = webapp.WSGIApplication([
	  (r'.*', Poll)], debug=True)
	wsgiref.handlers.CGIHandler().run(app)
	
if __name__ == "__main__":
	main()