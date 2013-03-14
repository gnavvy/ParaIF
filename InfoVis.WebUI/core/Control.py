__author__ = 'Yang'

import collections
import scipy as sp
from scipy import linalg as la
from sklearn.cluster import *


class Cluster:
    n = 0
    vol = 0
    A = None        # adjacency matrix
    D = None        # degree matrix
    L = None        # laplacian matrix

    def __init__(self, nodes, edges):
        degree = dict(collections.Counter([n for e in edges for n in e]))
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

    def spectral(self, n_clusters):
        clustering = SpectralClustering(n_clusters=n_clusters, affinity="precomputed")
        return clustering.fit_predict(sp.array(self.A))
        # spt.fit(sp.array(self.A))
        # return spt.labels_

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