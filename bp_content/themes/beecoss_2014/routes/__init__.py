"""
Using redirect route instead of simple routes since it supports strict_slash
Simple route: http://webapp-improved.appspot.com/guide/routing.html#simple-routes
RedirectRoute: http://webapp-improved.appspot.com/api/webapp2_extras/routes.html#webapp2_extras.routes.RedirectRoute
"""
from webapp2_extras.routes import RedirectRoute
from bp_content.themes.beecoss_2014.handlers import handlers

secure_scheme = 'https'

# Here go your routes, you can overwrite boilerplate routes (bp_includes/routes)

_routes = [
    RedirectRoute('/coto/', handlers.BiographyHandler, name='biography', strict_slash=True),
    RedirectRoute('/projects/my-projects', handlers.MyProjectsHandler, name='my-projects', strict_slash=True),
    RedirectRoute('/projects/code-snippets', handlers.CodeSnippetsHandler, name='code-snippets', strict_slash=True),
]

def get_routes():
    return _routes

def add_routes(app):
    if app.debug:
        secure_scheme = 'http'
    for r in _routes:
        app.router.add(r)
