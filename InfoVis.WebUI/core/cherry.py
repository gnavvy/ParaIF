__author__ = 'Yang'

import json
import model
import cherrypy


class node:
    name = -1
    group = 0

    def __init__(self, name, group):
        self.name = name
        self.group = group

    @staticmethod
    def serialize(node):
        return {"name": node.name, "group": node.group}


class edge:
    source = target = -1
    value = 0.0

    def __init__(self, source, target, value):
        self.source = source
        self.target = target
        self.value = value

    @staticmethod
    def serialize(edge):
        return {"source": edge.source, "target": edge.target, "weight": edge.value}


class cherry:
    m = None
    edges_json = ""
    nodes_json = ""

    def __init__(self):
        ego_id = 1684
        count = -1
        self.m = model.model("./data/facebook")
        self.m.loadCircles(ego_id)
        nodes, edges = self.m.loadEdges(ego_id, count)
        nodes = [node(n, self.m.getGroupID(n)) for n in nodes]
        nodes.sort(key=lambda n: n.group)
        edges = [edge(e[0], e[1], 1.0) for e in edges]

        self.nodes_json = json.dumps(nodes, default=node.serialize)
        self.edges_json = json.dumps(edges, default=edge.serialize)

    @cherrypy.expose
    def index(self):
        return "Hello World!" if self.m else "???"

    @cherrypy.expose
    def getNodes(self):
        return self.nodes_json

    @cherrypy.expose
    def getEdges(self):
        return self.edges_json


if __name__ == "__main__":
    cherrypy.server.socket_host = "gnavvy.cs.ucdavis.edu"
    cherrypy.server.socket_port = 4000
    cherrypy.quickstart(cherry())