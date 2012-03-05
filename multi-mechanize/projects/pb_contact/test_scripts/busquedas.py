import mechanize
import time

class Transaction(object):
	def __init__(self):
		self.numero=1
		self.email = 'coto@multimechanize.com'
		self.subject = 'Pruebas de Stress'
		self.message = 'Aqui mi comentario numero '

	def run(self):
		#Visita el sitio
		self.custom_timers = {}
		
		br = mechanize.Browser()
		br.set_handle_robots(False)
		
		start_timer = time.time()
		resp = br.open('http://www.protoboard.cl/contact')
		resp.read()
		latency = time.time() - start_timer

		#Formulario de contacto	
		br.select_form(nr=0)

		self.numero = self.numero + 1
		self.message = self.message + str(self.numero)
		br.form['email'] = self.email
		br.form['subject'] = self.subject + ', latency:'+ str(latency)
		br.form['message'] = self.message
		resp = br.submit()  
		resp.read()

if __name__ == '__main__':
    trans = Transaction()
    trans.run()
