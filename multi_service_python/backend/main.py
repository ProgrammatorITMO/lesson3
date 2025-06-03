from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from typing import Any
import os
import requests
from PIL import Image
import shutil

app = FastAPI()

PORT = os.getenv("PORT")
CRUD_URL = os.getenv("CRUD_URL")
CRUD_PORT = os.getenv("CRUD_PORT")
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), 'uploads')
CRUD_SERVICE_URL = f"{CRUD_URL}:{CRUD_PORT}/files"

os.makedirs(UPLOADS_DIR, exist_ok=True)


@app.post("/upload2", status_code=201, responses={
    201: {
        "description": "Изображение обработано и данные отправлены",
        "content": {
            "application/json": {
                "example": {
                    "message": "Изображение обработано и данные отправлены",
                    "crudResponse": {
                        "message": "Файл успешно создан",
                        "fileName": "1.json"
                    }
                }
            }
        }
    },
    400: {
        "description": "Файл не загружен",
        "content": {
            "application/json": {
                "example": {
                    "error": "Файл не загружен"
                }
            }
        }
    },
    500: {
        "description": "Ошибка при обработке изображения",
        "content": {
            "application/json": {
                "example": {
                    "error": "Ошибка при обработке изображения"
                }
            }
        }
    }
})
async def upload_image(image: UploadFile = File(...)):
    if not image:
        raise HTTPException(status_code=400, detail="Файл не загружен")

    try:
        file_path = os.path.join(UPLOADS_DIR, image.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        with Image.open(file_path) as img:
            width, height = img.size

        file_size = os.path.getsize(file_path)

        file_info = {
            "name": image.filename,
            "weight": file_size,  # размер в байтах
            "width": width,
            "height": height
        }

        response = requests.post(CRUD_SERVICE_URL, json=file_info)
        response.raise_for_status()

        return {
            "message": "Изображение обработано и данные отправлены",
            "crudResponse": response.json()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке изображения: {str(e)}")

