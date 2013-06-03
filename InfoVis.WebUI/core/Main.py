__author__ = 'Yang'

import scipy as sp
import networkx as nx
import matplotlib.pyplot as plt
from math import floor
from collections import Counter
from Model import Node, Edge, NodeLinkGraph
from View import Gosper
from Control import Cluster


def _dummy():
    n_points = 240000
    n_clusters = 12
    seg = int(floor(n_points / n_clusters))
    nodes = [Node(i, int(floor(i / seg))) for i in range(n_points)]
    edges = []
    return nodes, edges


def _snap():
    ego_id = 0
    count = -1
    n_clusters = 6

    graph = NodeLinkGraph("./data/facebook")
    nodes, edges = graph.loadEdges(ego_id, count)
    c = Cluster(nodes, edges)
    labels = c.hierarchical(n_clusters)
    # nodes.sort()
    # nodes = [Node(nodes[i], int(labels[i])) for i in range(len(nodes))]
    # nodes.sort(key=lambda n: n.group)
    # edges = [Edge(e[0], e[1], 1.0) for e in edges]
    return nodes, edges, labels


def draw_graph(nodes, edges, labels):
    G = nx.Graph()
    gosper = Gosper()
    islands = {
        6: [0, 1, 6, 5, 4, 3],
        12: [1, 2, 3, 18, 17, 16, 15, 14, 13, 12, 11, 0]
    }
    color_dict = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    colors = [color_dict[l % len(color_dict)] for l in labels]
    
    # node_list = [n.name for n in nodes]
    # edge_list = [(e.source, e.target) for e in edges]

    G.add_nodes_from(nodes)
    G.add_edges_from(edges)

    length_per_segment = Counter(labels)
    print(length_per_segment)

    degree = 7
    order = 4
    n_clusters = 6

    graph_pos = {}

    global_id = 0
    for seg in length_per_segment:
        offset = islands[n_clusters][seg] / degree
        length = length_per_segment[seg]
        span = (1.0 / degree) / (length - 1)
        for i in range(length):
            x, y = gosper.index2coord19(span * i + offset, order)
            node_id = nodes[global_id + i]
            graph_pos[node_id] = [x, y]
        global_id += length

    print(graph_pos)

    # draw graph
    nx.draw_networkx_nodes(G, graph_pos, node_size=1, alpha=0.1, node_color=colors)
    nx.draw_networkx_edges(G, graph_pos, width=1, alpha=0.1, edge_color='blue')
    # nx.draw_networkx_labels(G, graph_pos, font_size=node_text_size, font_family=text_font)

    # show graph
    plt.subplots_adjust(-0.01, -0.01, 1.01, 1.01, -0.01, 0.00)
    # plt.subplots_adjust(0, 0, 1, 1, 0, 0)
    plt.show()


# nodes, edges, labels = _snap()
# draw_graph(nodes, edges, labels)

import math
for dec in range(1, 1000, 1):
    dec *= 0.001
    print(dec, (2.0 + math.log10(dec)) / 2.0)
    # print(dec, -(math.log10(0.01) + math.log10(dec) / math.log10(0.01)))
