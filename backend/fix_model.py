import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.mixed_precision import Policy
from tensorflow.keras.layers import InputLayer

# 1. Define a "Wrapper" class that knows how to handle the old keyword
class PatchedInputLayer(InputLayer):
    def __init__(self, *args, **kwargs):
        # If 'batch_shape' exists, rename it to 'batch_input_shape'
        if "batch_shape" in kwargs:
            kwargs["batch_input_shape"] = kwargs.pop("batch_shape")
        super().__init__(*args, **kwargs)

MODEL_PATH = r"D:\projects\edp\Guardian-Eye---CCTV-anomaly-detection\best_lrcn_model.h5"

try:
    print(f"Attempting to load model with Custom Object mapping...")
    
    # 2. Tell load_model to use our PatchedInputLayer instead of the default one
    model = load_model(
        MODEL_PATH,
        compile=False,
        custom_objects={
            "DTypePolicy": Policy,
            "InputLayer": PatchedInputLayer,
            "BatchNormalization": tf.keras.layers.BatchNormalization # Common culprit for 'synchronized'
        }
    )
    
    print("✅ SUCCESS: Model loaded into memory!")
    
    # 3. Save it to a NEW file to strip out the old incompatible metadata
    model.save("models/best_lrcn_model_fixed.h5")
    print("✅ SAVED: 'models/best_lrcn_model_fixed.h5' is now ready for use.")

except Exception as e:
    print(f"❌ Still failing: {e}")