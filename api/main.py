from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from typing import List, Optional
import os
import uuid
import shutil
from datetime import datetime
from pydantic import BaseModel

app = FastAPI(
    title="Koveh Invest API",
    description="API для получения данных об инвестициях и акциях",
    version="1.0.0",
)

# Настраиваем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене лучше указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Базовая директория для хранения файлов
FILES_DIRECTORY = "/var/lib/koveh-invest/files"
DOCUMENTS_DIRECTORY = "/var/lib/koveh-invest/documents"

# Создаем директории, если их нет
os.makedirs(FILES_DIRECTORY, exist_ok=True)
os.makedirs(DOCUMENTS_DIRECTORY, exist_ok=True)

# Модели данных
class StockData(BaseModel):
    symbol: str
    name: str
    price: float
    currency: str
    change: float
    change_percent: float
    market_cap: Optional[float] = None
    volume: Optional[int] = None
    sector: Optional[str] = None
    description: Optional[str] = None

class DocumentInfo(BaseModel):
    id: str
    filename: str
    uploaded_at: datetime
    size: int
    file_type: str

@app.get("/")
async def root():
    return {"message": "Добро пожаловать в Koveh Invest API!"}

# Эндпоинты для работы с текстовыми данными акций
@app.get("/invest/stocks/{symbol}")
async def get_stock_data(symbol: str):
    """Получение данных о конкретной акции по её символу"""
    # Здесь будет логика получения данных из базы данных или внешнего API
    # В качестве примера возвращаем моковые данные
    
    # В реальном приложении здесь должна быть проверка существования акции
    if symbol.upper() not in ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]:
        raise HTTPException(status_code=404, detail=f"Акция с символом {symbol} не найдена")
    
    # Пример данных
    stock_data = {
        "AAPL": StockData(
            symbol="AAPL",
            name="Apple Inc.",
            price=174.79,
            currency="USD",
            change=1.25,
            change_percent=0.72,
            market_cap=2.74e12,
            volume=63521400,
            sector="Technology",
            description="Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide."
        ),
        "MSFT": StockData(
            symbol="MSFT",
            name="Microsoft Corporation",
            price=328.79,
            currency="USD",
            change=2.47,
            change_percent=0.76,
            market_cap=2.43e12,
            volume=21473500,
            sector="Technology",
            description="Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide."
        )
    }
    
    # Если у нас есть данные о запрошенной акции, возвращаем их
    if symbol.upper() in stock_data:
        return stock_data[symbol.upper()]
    
    # Иначе создаем моковые данные для других акций
    return StockData(
        symbol=symbol.upper(),
        name=f"{symbol.upper()} Corporation",
        price=float(ord(symbol[0])) + float(ord(symbol[-1])),
        currency="USD",
        change=float(ord(symbol[0])) / 10,
        change_percent=float(ord(symbol[0])) / 100,
        sector="Undefined",
        description=f"This is a placeholder description for {symbol.upper()}"
    )

@app.get("/invest/stocks")
async def get_stocks(
    sector: Optional[str] = None, 
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Получение списка акций с возможностью фильтрации по сектору"""
    # Здесь будет логика получения данных из базы данных
    # В качестве примера возвращаем моковые данные
    
    stocks = [
        StockData(
            symbol="AAPL",
            name="Apple Inc.",
            price=174.79,
            currency="USD",
            change=1.25,
            change_percent=0.72,
            sector="Technology"
        ),
        StockData(
            symbol="MSFT",
            name="Microsoft Corporation",
            price=328.79,
            currency="USD",
            change=2.47,
            change_percent=0.76,
            sector="Technology"
        ),
        StockData(
            symbol="GOOGL",
            name="Alphabet Inc.",
            price=134.99,
            currency="USD",
            change=0.94,
            change_percent=0.70,
            sector="Technology"
        ),
        StockData(
            symbol="JPM",
            name="JPMorgan Chase & Co.",
            price=184.31,
            currency="USD",
            change=1.16,
            change_percent=0.63,
            sector="Finance"
        ),
        StockData(
            symbol="BAC",
            name="Bank of America Corporation",
            price=37.12,
            currency="USD",
            change=0.18,
            change_percent=0.49,
            sector="Finance"
        )
    ]
    
    # Фильтрация по сектору
    if sector:
        filtered_stocks = [stock for stock in stocks if stock.sector and stock.sector.lower() == sector.lower()]
    else:
        filtered_stocks = stocks
    
    # Применяем пагинацию
    paginated_stocks = filtered_stocks[offset:offset + limit]
    
    return {
        "total": len(filtered_stocks),
        "offset": offset,
        "limit": limit,
        "stocks": paginated_stocks
    }

# Эндпоинты для работы с файлами
@app.post("/invest/files/upload")
async def upload_file(file: UploadFile = File(...)):
    """Загрузка файла в систему"""
    try:
        # Генерируем уникальный идентификатор для файла
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        
        # Создаем путь для сохранения файла
        file_path = os.path.join(FILES_DIRECTORY, f"{file_id}{file_extension}")
        
        # Сохраняем файл
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Получаем размер файла
        file_size = os.path.getsize(file_path)
        
        return {
            "id": file_id,
            "filename": file.filename,
            "size": file_size,
            "file_type": file.content_type,
            "uploaded_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при загрузке файла: {str(e)}")

@app.get("/invest/files/{file_id}")
async def get_file(file_id: str):
    """Получение файла по его идентификатору"""
    try:
        # Ищем файл в директории
        for filename in os.listdir(FILES_DIRECTORY):
            if filename.startswith(file_id):
                file_path = os.path.join(FILES_DIRECTORY, filename)
                return FileResponse(path=file_path, filename=filename)
        
        # Если файл не найден
        raise HTTPException(status_code=404, detail=f"Файл с ID {file_id} не найден")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Ошибка при получении файла: {str(e)}")

@app.get("/invest/files")
async def list_files(limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0)):
    """Получение списка загруженных файлов"""
    try:
        files_info = []
        
        # Получаем список файлов
        files = os.listdir(FILES_DIRECTORY)
        
        for filename in files:
            file_path = os.path.join(FILES_DIRECTORY, filename)
            
            # Получаем информацию о файле
            stat_info = os.stat(file_path)
            file_id = os.path.splitext(filename)[0]
            
            # Определяем тип файла
            file_extension = os.path.splitext(filename)[1].lower()
            file_type = {
                ".pdf": "application/pdf",
                ".doc": "application/msword",
                ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xls": "application/vnd.ms-excel",
                ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".txt": "text/plain",
                ".csv": "text/csv",
                ".json": "application/json",
            }.get(file_extension, "application/octet-stream")
            
            files_info.append({
                "id": file_id,
                "filename": filename,
                "size": stat_info.st_size,
                "file_type": file_type,
                "uploaded_at": datetime.fromtimestamp(stat_info.st_mtime).isoformat()
            })
        
        # Применяем пагинацию
        paginated_files = files_info[offset:offset + limit]
        
        return {
            "total": len(files_info),
            "offset": offset,
            "limit": limit,
            "files": paginated_files
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении списка файлов: {str(e)}")

@app.delete("/invest/files/{file_id}")
async def delete_file(file_id: str):
    """Удаление файла по его идентификатору"""
    try:
        # Ищем файл в директории
        for filename in os.listdir(FILES_DIRECTORY):
            if filename.startswith(file_id):
                file_path = os.path.join(FILES_DIRECTORY, filename)
                os.remove(file_path)
                return {"message": f"Файл {filename} успешно удален"}
        
        # Если файл не найден
        raise HTTPException(status_code=404, detail=f"Файл с ID {file_id} не найден")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении файла: {str(e)}")

# Эндпоинты для работы с документами (PDF, анализы и т.д.)
@app.post("/invest/documents/upload")
async def upload_document(document: UploadFile = File(...)):
    """Загрузка документа в систему"""
    try:
        # Генерируем уникальный идентификатор для документа
        doc_id = str(uuid.uuid4())
        file_extension = os.path.splitext(document.filename)[1]
        
        # Создаем путь для сохранения документа
        doc_path = os.path.join(DOCUMENTS_DIRECTORY, f"{doc_id}{file_extension}")
        
        # Сохраняем документ
        with open(doc_path, "wb") as buffer:
            shutil.copyfileobj(document.file, buffer)
        
        # Получаем размер документа
        doc_size = os.path.getsize(doc_path)
        
        return {
            "id": doc_id,
            "filename": document.filename,
            "size": doc_size,
            "file_type": document.content_type,
            "uploaded_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при загрузке документа: {str(e)}")

@app.get("/invest/documents/{doc_id}")
async def get_document(doc_id: str):
    """Получение документа по его идентификатору"""
    try:
        # Ищем документ в директории
        for filename in os.listdir(DOCUMENTS_DIRECTORY):
            if filename.startswith(doc_id):
                doc_path = os.path.join(DOCUMENTS_DIRECTORY, filename)
                return FileResponse(path=doc_path, filename=filename)
        
        # Если документ не найден
        raise HTTPException(status_code=404, detail=f"Документ с ID {doc_id} не найден")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Ошибка при получении документа: {str(e)}")

@app.get("/invest/documents")
async def list_documents(
    doc_type: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100), 
    offset: int = Query(0, ge=0)
):
    """Получение списка загруженных документов с возможностью фильтрации по типу"""
    try:
        docs_info = []
        
        # Получаем список документов
        docs = os.listdir(DOCUMENTS_DIRECTORY)
        
        for filename in docs:
            doc_path = os.path.join(DOCUMENTS_DIRECTORY, filename)
            
            # Получаем информацию о документе
            stat_info = os.stat(doc_path)
            doc_id = os.path.splitext(filename)[0]
            
            # Определяем тип документа
            file_extension = os.path.splitext(filename)[1].lower()
            file_type = {
                ".pdf": "application/pdf",
                ".doc": "application/msword",
                ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xls": "application/vnd.ms-excel",
                ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".txt": "text/plain",
            }.get(file_extension, "application/octet-stream")
            
            # Фильтрация по типу документа
            if doc_type and file_type != doc_type:
                continue
            
            docs_info.append({
                "id": doc_id,
                "filename": filename,
                "size": stat_info.st_size,
                "file_type": file_type,
                "uploaded_at": datetime.fromtimestamp(stat_info.st_mtime).isoformat()
            })
        
        # Применяем пагинацию
        paginated_docs = docs_info[offset:offset + limit]
        
        return {
            "total": len(docs_info),
            "offset": offset,
            "limit": limit,
            "documents": paginated_docs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении списка документов: {str(e)}")

@app.delete("/invest/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Удаление документа по его идентификатору"""
    try:
        # Ищем документ в директории
        for filename in os.listdir(DOCUMENTS_DIRECTORY):
            if filename.startswith(doc_id):
                doc_path = os.path.join(DOCUMENTS_DIRECTORY, filename)
                os.remove(doc_path)
                return {"message": f"Документ {filename} успешно удален"}
        
        # Если документ не найден
        raise HTTPException(status_code=404, detail=f"Документ с ID {doc_id} не найден")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении документа: {str(e)}")

# Запуск приложения
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 