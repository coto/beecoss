# -*- coding: utf-8 -*-

"""
    Handlers for Beecoss 2014 theme
"""
# standard library imports

# related third party imports

# local application/library specific imports
from bp_includes.lib.basehandler import BaseHandler


class BiographyHandler(BaseHandler):
    """
    My Biography
    """

    def get(self, **kwargs):
        params = {}
        return self.render_template('biography.html', **params)

class MyProjectsHandler(BaseHandler):
    """
    My Projects
    """

    def get(self, **kwargs):
        params = {}
        return self.render_template('my_projects.html', **params)


class CodeSnippetsHandler(BaseHandler):
    """
    Code Snippets Handler
    """

    def get(self, **kwargs):
        params = {}
        return self.render_template('code_snippets.html', **params)



