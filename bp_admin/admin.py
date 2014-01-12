# -*- coding: utf-8 -*-
from boilerplate import models
from boilerplate.handlers import BaseHandler
from google.appengine.api import users
from collections import Counter


class AdminLogoutHandler(BaseHandler):
    def get(self):
        self.redirect(users.create_logout_url(dest_url=self.uri_for('home')))


class AdminThemeHandler(BaseHandler):
    def get(self):
        users = models.User.query().fetch(projection=['country'])
        users_by_country = Counter()
        for user in users:
            if user.country:
                users_by_country[user.country] += 1
        params = {
            "data": users_by_country.items()
        }
        return self.render_template('admin_users_geochart.html', **params)
