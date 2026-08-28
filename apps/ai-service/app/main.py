import io
import numpy as np
import cv2
import onnxruntime as ort
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI(title="Crop-AI Inference")
session = None

def load_model():
    global session
    # Use GPU if available
    providers = ['CUDAExecutionProvider', 'CPUExecutionProvider'] if ort.get_device() == 'GPU' else ['CPUExecutionProvider']
    session = ort.InferenceSession("models/crop-disease.onnx", providers=providers)

@app.on_event("startup")
def startup_event():
    load_model()

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # Resize to 224x224 (adjust to your model's input size)
    img = cv2.resize(img, (224, 224))
    # Convert BGR to RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    # Normalize to [0,1] and transpose to NCHW
    img = img.astype(np.float32) / 255.0
    img = np.transpose(img, (2, 0, 1))
    # Add batch dimension
    img = np.expand_dims(img, axis=0)
    return img

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        input_tensor = preprocess_image(image_bytes)
        outputs = session.run(["output"], {"input": input_tensor})[0]
        probabilities = outputs[0].tolist()
        class_names = ["Healthy", "Early Blight", "Late Blight", "Rust"] # Replace with your own
        class_info = {
            "Healthy": {
                "disease": "None",
                "treatment": "No treatment needed. Maintain regular crop care.",
            },
            "Early Blight": {
                "disease": "Early Blight (Alternaria solani)",
                "treatment": "Apply copper-based or chlorothalonil fungicide and remove infected leaves.",
            },
            "Late Blight": {
                "disease": "Late Blight (Phytophthora infestans)",
                "treatment": "Apply systemic fungicides (e.g., metalaxyl) and improve air circulation.",
            },
            "Rust": {
                "disease": "Rust (Puccinia spp.)",
                "treatment": "Apply sulfur or tebuconazole fungicide and practice crop rotation.",
            },
        }
        top_index = int(np.argmax(probabilities))
        label = class_names[top_index]
        info = class_info.get(label, {"disease": None, "treatment": None})
        return {
            "success": True,
            "prediction": label,
            "confidence": float(max(probabilities)),
            "disease": info["disease"],
            "treatment": info["treatment"],
            "all_scores": dict(zip(class_names, probabilities)),
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})