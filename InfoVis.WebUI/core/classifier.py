import cherrypy
from cherrypy import expose
from sklearn import svm
import numpy as np
import pylab as pl

class Classifier:
    classifier = svm.SVC(kernel='linear')
    x_train = []
    y_train = []

    def format(self, string):
        chars = string.replace(",", " ").split()
        numbs = [int(char) for char in chars if char.isdigit()]
        return numbs

    @expose
    def index(self):
        return "Hello World!"

    @expose
    def reset(self):
        self.x_train = []
        self.y_train = []
        return "reset"

    @expose
    def add(self, entry):
        print("entry: " + entry)
        numbs = self.format(entry)
        label = numbs.pop()
        coord = zip(numbs[::2], numbs[1::2])
        self.x_train.extend(coord)
        for c in coord:
            self.y_train.append(label)
        return "new data entry added."

    @expose
    def retrain(self):
        print(self.x_train, self.y_train)
        self.classifier.fit(self.x_train, self.y_train)
        sv = self.classifier.support_vectors_
        return str(sv)

    @expose
    def test(self, entry):
        numbs = self.format(entry)
        print("test numbs: ", numbs)
        result = self.classifier.predict(numbs)[0]
        print("result:", result)
        return str(result)

    @expose
    def testRect(self, rect):
        result = []
        numbs = self.format(rect)
        print("testRect numbs:", numbs)
        for x in range(0, numbs[0], 10):
            for y in range(0, numbs[1], 10):
                dec = self.classifier.predict([x,y])[0]
                result.append(dec)
        return str(result)

cherrypy.server.socket_host = 'gnavvy.cs.ucdavis.edu'
cherrypy.server.socket_port = 4000
cherrypy.quickstart(Classifier())