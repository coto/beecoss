
from google.appengine.ext import ndb

class VisitLog(ndb.Model):
    uastring = ndb.StringProperty()
    ip = ndb.StringProperty()
    timestamp = ndb.StringProperty()