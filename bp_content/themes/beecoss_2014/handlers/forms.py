__author__ = 'coto'

from bp_includes.external.wtforms import fields
from bp_includes.external.wtforms import Form
from bp_includes.external.wtforms import validators
from bp_includes.lib import utils
from webapp2_extras.i18n import lazy_gettext as _
from webapp2_extras.i18n import ngettext, gettext

FIELD_MAXLENGTH = 50 # intended to stop maliciously long input


class FormTranslations(object):
    def gettext(self, string):
        return gettext(string)

    def ngettext(self, singular, plural, n):
        return ngettext(singular, plural, n)


class BaseForm(Form):
    def __init__(self, request_handler):
        super(BaseForm, self).__init__(request_handler.request.POST)

    def _get_translations(self):
        return FormTranslations()


class EmailMixin(BaseForm):
    email = fields.TextField(_('Email'), [validators.Required(),
                                          validators.Length(min=8, max=FIELD_MAXLENGTH, message=_(
                                                    "Field must be between %(min)d and %(max)d characters long.")),
                                          validators.regexp(utils.EMAIL_REGEXP, message=_('Invalid email address.'))])


# ==== Forms ====

class ContactForm(EmailMixin):
    name = fields.TextField(_('Name'), [validators.Required(),
                                        validators.Length(max=FIELD_MAXLENGTH, message=_(
                                                    "Field cannot be longer than %(max)d characters.")),
                                        validators.regexp(utils.NAME_LASTNAME_REGEXP, message=_(
                                                    "Name invalid. Use only letters and numbers."))])

    phone = fields.TextField(_('Phone'), [validators.Length(max=FIELD_MAXLENGTH, message=_(
                                                    "Field cannot be longer than %(max)d characters."))])

    subject = fields.TextField(_('Subject'), [validators.Length(max=FIELD_MAXLENGTH, message=_(
                                                    "Field cannot be longer than %(max)d characters."))])

    message = fields.TextAreaField(_('Message'), [validators.Required(), validators.Length(max=65536)])
    pass
