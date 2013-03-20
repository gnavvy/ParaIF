from scipy.sparse.csr import csr_matrix

__author__ = 'Yang'

import scipy as sp
from scipy import linalg as la
from sklearn.cluster import Ward, SpectralClustering
from collections import Counter
from scipy import sparse
from scipy.sparse import csr_matrix as csr

class Cluster:
    n = 0
    vol = 0
    A = None        # adjacency matrix
    D = None        # degree matrix
    L = None        # laplacian matrix

    def __init__(self, nodes, edges):
        degree = dict(Counter([n for e in edges for n in e]))
        self.vol = sum(degree)
        self.n = N = len(nodes)  # dimension of all matrix
        self.A = sp.asmatrix(sp.zeros([N, N]))
        self.D = sp.asmatrix(sp.zeros([N, N]))

        for edge in edges:     # fill affinity matrix
            i = nodes.index(edge[0])   # source
            j = nodes.index(edge[1])   # target
            self.A[i, j] = self.A[j, i] = 1.0

        for node in nodes:     # fill degree matrix
            i = nodes.index(node)
            self.D[i, i] = degree[node]

        self.L = sp.asmatrix(self.D - self.A)

    def spectral(self, n_clusters):
        clustering = SpectralClustering(n_clusters=n_clusters, affinity="precomputed")
        return clustering.fit_predict(sp.array(self.A))

    def hierarchical(self, n_clusters):
        ward = Ward(n_clusters=n_clusters)
        return ward.fit_predict(sp.array(self.A))

    def agglomerate(self, nodes, edges, clusters):
        if len(nodes) != len(clusters):
            print("#nodes(%d) != #clusters(%d)" % (len(nodes), len(clusters)))

        neighbors = {}
        for edge in edges:
            if edge[0] in neighbors:
                neighbors[edge[0]].append(edge[1])
            else:
                neighbors[edge[0]] = [edge[1]]

        node_clusters = {}  # node: its cluster id
        communities = {}    # cluster id: all neighbors for its members
        for i in range(len(nodes)):
            if clusters[i] in communities:
                communities[clusters[i]].extend(neighbors[nodes[i]])
            else:
                communities[clusters[i]] = neighbors[nodes[i]]
            node_clusters[nodes[i]] = clusters[i]

        N = len(communities)
        affinity_matrix = sp.zeros([N, N])
        for comm in communities:
            members = [node_clusters[node] for node in communities[comm]]
            degree = dict(Counter(members))
            for key in degree:
                affinity_matrix[comm, key] = degree[key]

        ward = Ward(n_clusters=6)
        predicts = ward.fit_predict(affinity_matrix)

        return [predicts[node_clusters[node]] for node in nodes]

    def constraint(self, nodes, edges, lables):
        if len(nodes) != len(lables):
            print("#nodes(%d) != #clusters(%d)" % (len(nodes), len(lables)))

        N = len(nodes)
        circles = {}

        guidance_matrix = sp.zeros([N, N])
        # guidance_matrix = {}
        for i in range(len(nodes)):
            if lables[i] in circles:
                circles[lables[i]].append(nodes[i])
            else:
                circles[lables[i]] = [nodes[i]]

        for key in circles.iterkeys():
            print(key, len(circles[key]))

        c = 36
        for ni in circles[c]:
            i = nodes.index(ni)
            for nj in circles[c]:
                j = nodes.index(nj)
                guidance_matrix[i, j] = 1.0

        guidance_matrix = sparse.lil_matrix(guidance_matrix)

        # pos = sum(x > 0 for x in guidance_matrix)
        print(guidance_matrix)
        ward = Ward(n_clusters=6, n_components=2, connectivity=guidance_matrix)
        predicts = ward.fit_predict(self.A)

        print(predicts)
        # print(circles.keys(), len(circles.itervalues())


if __name__ == "__main__":
    sp.set_printoptions(precision=2, suppress=True)

    nodes = [1, 2, 3, 4, 5, 6]
    edges = [[1, 2], [1, 3], [2, 3], [3, 4], [4, 5], [4, 6], [5, 6]]
    Q1 = sp.asmatrix(sp.identity(6))

    Q = sp.mat([[1.0, 1.0, 1.0, 1.0, -1.0, -1.0],
                [1.0, 1.0, 1.0, 1.0, -1.0, -1.0],
                [1.0, 1.0, 1.0, 1.0, -1.0, -1.0],
                [1.0, 1.0, 1.0, 1.0, -1.0, -1.0],
                [-1.0, -1.0, -1.0, -1.0, 1.0, 1.0],
                [-1.0, -1.0, -1.0, -1.0, 1.0, 1.0]])

    c = Cluster(nodes, edges)
    vec = c.spectral(2)
    print(vec)
    # vec_idc = c.csp(Q1, 0, 3)




'''
    # Constrained spectral clustering
    def csp(self, Q, beta, K):
        N = self.n
        Dn = sp.asmatrix(sp.real(la.sqrtm(self.D))).I
        Ln = Dn * self.L * Dn
        Qn = Dn * Q * Dn

        U, sigma, V = la.svd(Qn)
        sigma_max = max(sigma)
        if beta >= sigma_max:
            print("beta >= sigma_max")
            return sp.zeros(N)

        Q1 = Qn - beta * sp.eye(N)
        print("Q1: ", Q1)

        val, vec = la.eig(Ln, Q1)
        val = sp.real(val)
        print("val: ", val)
        print("vec: ", vec)

        vec_pos = vec.T[val > 0.01]
        print("vec_pos: ", vec_pos)
        if len(vec_pos) == 0:
            print("No positive eigenvalues")
            return sp.zeros(N)

        vec_nor = vec_pos / la.norm(vec_pos) * sp.sqrt(self.vol)
        print("vec_nor: ", vec_nor)

        print("vec_nor.T: ", vec_nor.T)

        vLnvT = (vec_nor * Ln * vec_nor.T).diagonal()
        vLnvT = sp.squeeze(sp.asarray(vLnvT))
        print("vLnvT: ", vLnvT, " type: ", type(vLnvT))
        # print(sp.asarray(vLnvT))
        # print(sp.squeeze(sp.asarray(vLnvT)))


        # idx = bn.argpartsort(arr, arr.size-n, axis=None)[-n:]
        # index = sp.argmin(vLnvT)
        n = K - 1
        # index = bn.argpartsort(vLnvT, vLnvT.size - n)[-n:]
        index = vLnvT.argsort()[:n]     # could be faster using bn
        print("index: ", index)

        vec_idc = vec_nor[index] * Dn
        print("vec_idc: ", vec_idc)
        return vec_idc  # indicator vector u*
'''