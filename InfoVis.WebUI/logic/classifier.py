import cherrypy
from cherrypy import expose
from sklearn import svm

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
        return "retrained"

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
        print("testRect rect:", rect)
        for x in range(0, rect[0]):
            for y in range(0, rect[1]):
                result.append(self.classifier.predict([x,y])[0])
        return result

cherrypy.server.socket_host = 'gnavvy.cs.ucdavis.edu'
cherrypy.server.socket_port = 4000
cherrypy.quickstart(Classifier())