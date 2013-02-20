__author__ = 'Yang'

import collections
import scipy as sp
from scipy import linalg as la


class cluster:
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

    # K-way constrained spectral clustering
    def csp_K(self, Q, K, beta):
        N = self.n
        I = sp.identity(N)
        Dn = sp.asmatrix(sp.real(la.sqrtm(self.D))).I
        Ln = Dn.dot(self.L).dot(Dn)
        Qn = Dn.dot(Q).dot(Dn)

        U, sigma, V = la.svd(Qn)
        sigma_max = max(sigma)
        if beta >= sigma_max * self.vol:
            return sp.zeros(N)

        Q1 = Qn - (float(beta) / self.vol) * I
        val, vec = la.eig(Ln, Q1)

        vec_pos = vec[val > 0]
        if len(vec_pos) == 0:
            return sp.zeros(N)

        vec_nor = (vec_pos / la.norm(vec_pos)) * sp.sqrt(self.vol)
        tmp = vec_nor * Ln * sp.transpose(vec_nor)
        print(tmp)
        index = sp.argmin(vec_nor * Ln * sp.transpose(vec_nor))
        # print(vec_nor)
        print(index)
        vec_opt = vec_nor[index]
        # vec_opt = vec_nor[sp.argmin(vec_nor * Ln * sp.transpose(vec_nor))]
        # print(Dn)
        return Dn.dot(vec_opt)  # indicator vector u*


if __name__ == "__main__":
    sp.set_printoptions(precision=2, suppress=True)

    nodes = [1, 2, 3, 4, 5, 6]
    edges = [[1, 2], [1, 3], [2, 3], [3, 4], [4, 5], [4, 6], [5, 6]]
    Q = sp.mat([[1.0, 1.0, 1.0, 1.0, -1.0, -1.0],
                [1.0, 1.0, 1.0, 1.0, -1.0, -1.0],
                [1.0, 1.0, 1.0, 1.0, -1.0, -1.0],
                [1.0, 1.0, 1.0, 1.0, -1.0, -1.0],
                [-1.0, -1.0, -1.0, -1.0, 1.0, 1.0],
                [-1.0, -1.0, -1.0, -1.0, 1.0, 1.0]])

    c = cluster(nodes, edges)
    # vec_idc = c.csp_K(Q, 2, 21)
    for i in range(1, 3):
        print(i, c.csp_K(Q, 2, i*21))