import mechanize
import time

class Transaction(object):
	def __init__(self):
		self.numero=1
		self.email = 'foo@boo.com'
		self.subject = 'T'
		self.message = 'foo'

	def run(self):
		#Visita el sitio
		self.custom_timers = {}
		
		br = mechanize.Browser()
		br.set_handle_robots(False)
		br.addheaders = [('User-agent', 'Mozilla/5.0 Compatible')]
		
		start_timer = time.time()
		resp = br.open('http://www.uss.cl/contacto/')
		resp.read()
		latency = time.time() - start_timer

		#Formulario de contacto	
		br.select_form(nr=1)

		self.numero = self.numero + 1
		self.message = self.message + str(self.numero)
		br.form['contact_email'] = self.email
		br.form['contact_name'] = self.subject + ', latency:'+ str(latency)
		br.form['contact_comment'] = self.message
		resp = br.submit()  
		resp.read()

if __name__ == '__main__':
    trans = Transaction()
    trans.run()
