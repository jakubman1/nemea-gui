from sys import path
from os import getcwd, environ
environ['NEMEA_SUPERVISOR_API_TEST'] = '1'

# Append to path so we can load liberouterapi
path.append(getcwd() + '/../../../../../backend')
import liberouterapi
import unittest
import json
import subprocess
from werkzeug.datastructures import Headers
from pdb import set_trace


class SupervisorApiTest:
    def __init__(self):
        self.role = 0
        self.app = liberouterapi.app.test_client()
        self.test_headers = Headers()
        self.test_headers.add('lgui-Authorization', 'aaaaaaaaaaaaaaaaa')

    @staticmethod
    def fake_session_lookup(sess_id):
        return {'user': SupervisorApiTest()}

    def __add_test_headers(self, args):
        if 'headers' not in args:
            args['headers'] = Headers()
        args['headers'].add('lgui-Authorization', 'aaaaaaaaaaaa')

        return args

    def get(self, url):
        return self.app.get(url, headers=self.test_headers)

    def post(self, url, **kwargs):
        return self.app.post(url, **self.__add_test_headers(kwargs))

    def delete(self, url, **kwargs):
        return self.app.delete(url, **self.__add_test_headers(kwargs))

    def post_json(self, url, **kwargs):
        kwargs = self.__add_test_headers(kwargs)
        kwargs['headers'].add('Content-Type', 'application/json')
        kwargs['data'] = json.dumps(kwargs['data'])

        return self.app.post(url, **kwargs)

    def put_json(self, url, **kwargs):
        kwargs = self.__add_test_headers(kwargs)
        kwargs['headers'].add('Content-Type', 'application/json')
        kwargs['data'] = json.dumps(kwargs['data'])

        return self.app.put(url, **kwargs)


class ControllerTest(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        super(ControllerTest, self).__init__(*args, **kwargs)
        self.app = liberouterapi.app.test_client()
        data = {"username": "admin","password":"admin","password2":"admin"}
        headers = Headers()
        headers.add('Content-Type', 'application/json')
        self.app.post('/setup', data=json.dumps(data), headers=headers)

    def setUp(self):
        # Make sure there are clean test data in sysrepo before each test
        for ds in ['startup', 'running']:
            subprocess.run(['sysrepocfg', '--del=/nemea-test-1:supervisor',
                              '--datastore=%s' % ds, 'nemea-test-1'],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(['sysrepocfg', '--import=./yang/set1.data.json',
                              '--datastore=%s' % ds,
                              '--format=json', 'nemea-test-1'],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(['sysrepocfg', '--del=/link-traffic-test-1:instance',
                              '--datastore=%s' % ds, 'link-traffic-test-1'],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(['sysrepocfg', '--import=./yang/link-traffic-test-1.data.json',
                              '--datastore=%s' % ds,
                              '--format=json', 'link-traffic-test-1'],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


liberouterapi.app.testing = True
liberouterapi.auth.lookup = SupervisorApiTest.fake_session_lookup
test = SupervisorApiTest()
__all__ = ['unittest', 'liberouterapi', 'test', 'set_trace', 'json', 'sr',
           'ControllerTest']
