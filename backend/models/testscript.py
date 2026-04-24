import h5py

f = h5py.File("best_lrcn_model.h5", "r")
print(list(f.keys()))