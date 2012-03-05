import mechanize
import time

class Transaction(object):
    def run(self):
        # create a Browser instance
        br = mechanize.Browser()
        # don't bother with robots.txt
        br.set_handle_robots(False)
        # add a custom header so wikipedia allows our requests
        br.addheaders = [('User-agent', 'Mozilla/5.0 Compatible')]

        # start the timer
        start_timer = time.time()
        # submit the request
        resp = br.open('http://www.fayerwayer.com/feed/')
        resp.read()
        # stop the timer
        latency = time.time() - start_timer

        # store the custom timer
        self.custom_timers['Load_Front_Page'] = latency

        # verify responses are valid
        assert (resp.code == 200), 'Bad HTTP Response'
        assert ('Consensus' in resp.get_data()), 'Text Assertion Failed'


if __name__ == '__main__':
    trans = Transaction()
    trans.run()
