__author__ = 'Yang'

import os
import random
from cluster import cluster
import scipy as sp
import collections


class model:
    circles = {}
    # group = {}
    edges = []
    nodes = []

    def __init__(self, dpath):
        os.chdir(dpath)

    def loadCircles(self, ego_id):
        self.circles = {}

        files = [f for f in os.listdir(".") if f.endswith("circles")]
        if ego_id >= 0:  # for specific ego_id
            files = [f for f in files if f.startswith(str(ego_id))]

        for cf in files:
            with open(cf, "r") as f:
                content = f.read().splitlines()
                for entry in content:
                    if len(entry) == 0:
                        continue
                    items = entry.split("\t")
                    circle_name = int(items.pop(0)[len("circles") - 1:])
                    nodes = [int(n) for n in items if n.isdigit()]
                    self.circles[circle_name] = nodes

    def getGroupID(self, node):
        groups = [g for g in self.circles.keys() if node in self.circles[g]]
        if len(groups) == 0:
            return -1
        else:
            return max(groups, key=lambda g: len(self.circles[g]))

    def loadEdges(self, ego_id, count):
        self.nodes = []
        self.edges = []

        files = [f for f in os.listdir(".") if f.endswith("edges")]
        if ego_id >= 0:  # for specific ego_id
            files = [f for f in files if f.startswith(str(ego_id))]

        for ef in files:
            with open(ef, "r") as f:
                content = f.read().splitlines()
                for entry in content:
                    if len(entry) == 0:
                        continue
                    if len(self.edges) > count - 1 and count > 0:
                        break
                    node_pair = [int(n) for n in entry.split() if n.isdigit()]
                    self.nodes.extend(node_pair)
                    self.edges.append(node_pair)

        self.nodes = list(set(self.nodes))
        self.nodes.sort()
        return self.nodes, self.edges

if __name__ == "__main__":
    m = model("./data/facebook")
    m.loadCircles(0)
    nodes, edges = m.loadEdges(0, 100)
    print(nodes)
    print(edges)