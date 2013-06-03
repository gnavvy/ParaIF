__author__ = 'Yang'

import json
import cherrypy
import time
from math import floor
from Control import Cluster
from Model import Node, Edge, NodeLinkGraph


class Cherry:
    edges_json = ""
    nodes_json = ""

    def __init__(self):
        nodes, edges = self.preprocessing()
        print('#nodes: ', len(nodes), "#edges: ", len(edges))
        self.nodes_json = json.dumps(nodes, default=Node.serialize)
        self.edges_json = json.dumps(edges, default=Edge.serialize)

    def preprocessing(self):
        ego_id = 1684
        count = -1
        n_clusters = 6

        graph = NodeLinkGraph("./data/facebook")
        nodes, edges = graph.loadEdges(ego_id, count)
        labels = graph.loadCircles(ego_id)
        c = Cluster(nodes, edges)

        # clusters1 = c.spectral(n_clusters)
        clusters1 = c.hierarchical(n_clusters)
        # clusters2 = c.agglomerate(nodes, edges, clusters1)
        # clusters3 = c.constraint(nodes, edges, labels)

        # st2 = time.time()
        # print(st2 - st)

        nodes = [Node(nodes[i], int(clusters1[i]), int(labels[i])) for i in range(len(nodes))]
        nodes.sort(key=lambda n: n.cluster)
        edges = [Edge(e[0], e[1], 1.0) for e in edges]
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
    cherrypy.server.socket_host = "127.0.0.1"
    cherrypy.server.socket_port = 4000
    cherrypy.quickstart(Cherry())