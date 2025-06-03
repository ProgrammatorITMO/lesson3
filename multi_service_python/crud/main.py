from fastapi import FastAPI, HTTPException, Body
from typing import Any
import os
import json

app = FastAPI()

PORT = 3000
FILES_DIR = os.getenv("FILES_DIR")
print(FILES_DIR)
os.makedirs(FILES_DIR, exist_ok=True)

def get_next_file_name() -> str:
    files = [f for f in os.listdir(FILES_DIR) if f.endswith('.json')]
    return f"{len(files) + 1}.json"

@app.post("/files", status_code=201)
async def create_file(
    body: Any = Body(
        ...,
        example={
            "name": "Пример файла",
            "version": 1,
            "data": {
                "message": "Привет, мир!",
                "tags": ["fastapi", "json", "файлы"]
            }
        }
    )
):
    file_name = get_next_file_name()
    file_path = os.path.join(FILES_DIR, file_name)

    try:
        # сохраняем как строку исходный JSON
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(json.dumps(body, indent=2, ensure_ascii=False))
        return {"message": "Файл успешно создан", "fileName": file_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при создании файла: {str(e)}")

@app.put("/files/{file_name}")
async def edit_file(
    file_name: str,
    body: Any = Body(
        ...,
        example={
            "name": "Обновленный файл",
            "version": 2,
            "data": {
                "message": "Обновленное сообщение",
                "tags": ["update", "fastapi", "json"]
            }
        }
    )
):
    file_path = os.path.join(FILES_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Файл не найден")

    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(json.dumps(body, indent=2, ensure_ascii=False))
        return {"message": "Файл успешно обновлен"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при редактировании файла: {str(e)}")

@app.delete("/files/{file_name}", responses={
    200: {
        "description": "Успешное удаление файла",
        "content": {
            "application/json": {
                "example": {
                    "message": "Файл успешно удален"
                }
            }
        }
    },
    404: {
        "description": "Файл не найден",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Файл не найден"
                }
            }
        }
    },
    500: {
        "description": "Ошибка при удалении файла",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Ошибка при удалении файла: описание_ошибки"
                }
            }
        }
    }
})
def delete_file(file_name: str):
    file_path = os.path.join(FILES_DIR, file_name)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Файл не найден")

    try:
        os.remove(file_path)
        return {"message": "Файл успешно удален"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении файла: {str(e)}")