import h5py

# 👉 PUT YOUR FULL MODEL PATH HERE
model_path = r"D:\projects\edp\Guardian-Eye---CCTV-anomaly-detection\best_lrcn_model.h5"

f = h5py.File(model_path, "r")

print("Model Keys:")
print(list(f.keys()))