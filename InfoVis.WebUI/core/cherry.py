__author__ = 'Yang'

import json
import cherrypy
from math import floor
from Control import Cluster
from Model import Node, Edge, NodeLinkGraph


class Cherry:
    edges_json = ""
    nodes_json = ""

    def __init__(self):
        nodes, edges = self._snap()
        print('#nodes: ', nodes.__len__())
        self.nodes_json = json.dumps(nodes, default=Node.serialize)
        self.edges_json = json.dumps(edges, default=Edge.serialize)

    def _snap(self):
        ego_id = 1684
        count = -1
        n_clusters = 12

        # graph = NodeLinkGraph("./data/twitter")
        graph = NodeLinkGraph("./data/facebook")
        # graph.loadCircles(ego_id)
        nodes, edges = graph.loadEdges(ego_id, count)
        c = Cluster(nodes, edges)
        # labels = c.spectral(n_clusters)
        labels = c.hierachical(n_clusters)
        nodes = [Node(nodes[i], int(labels[i])) for i in range(len(nodes))]
        nodes.sort(key=lambda n: n.group)
        edges = [Edge(e[0], e[1], 1.0) for e in edges]
        return nodes, edges

    def _dummy(self):
        n_points = 1900
        n_clusters = 19
        seg = int(floor(n_points / n_clusters))
        nodes = [Node(i, int(floor(i / seg))) for i in range(n_points)]
        edges = []
        return nodes, edges

    @cherrypy.expose
    def index(self):
        return "Hello World!"

    @cherrypy.expose
    def getNodes(self):
        return self.nodes_json

    @cherrypy.expose
    def getEdges(self):
        return self.edges_json


if __name__ == "__main__":
    cherrypy.server.socket_host = "gnavvy.cs.ucdavis.edu"
    cherrypy.server.socket_port = 4000
    cherrypy.quickstart(Cherry())