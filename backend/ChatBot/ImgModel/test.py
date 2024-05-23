import urllib.request
import numpy as np
import matplotlib.pyplot as plt
import urllib
import cv2
from sklearn.cluster import KMeans

def obj_seg_func(img_path, img_res_path):
    req = urllib.request.urlopen(img_path)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
    img = cv2.imdecode(arr, -1) # 'Load it as it is'
    
    # print(type(img), len(img))
    # img = cv2.imread(img_path)

    X = img.reshape(img.shape[0] * img.shape[1], img.shape[2])

    #K = [2, 3, 5, 7, 10, 15, 20, 30, 40, 50, 70]
    num_K = 2
    _kmean = KMeans(n_clusters = num_K).fit(X)
    label = _kmean.predict(X)

    img_vector = np.zeros_like(X)
    for k in range(num_K):
        img_vector[label == k] = _kmean.cluster_centers_[k]
    img_res = img_vector.reshape(img.shape[0], img.shape[1], img.shape[2])

    cv2.imwrite(img_res_path, img_res)
    
    
print("")