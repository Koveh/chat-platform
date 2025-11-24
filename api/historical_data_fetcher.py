import os
import sys
import json
import time
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
import yfinance as yf
import pandas as pd
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('historical_data_fetcher.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Загрузка переменных окружения
load_dotenv()

# Конфигурация базы данных
DB_CONFIG = {
    'dbname': os.getenv('DB_NAME', 'stock_analytics'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password'),
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432')
}

def get_db_connection():
    """Создание подключения к базе данных"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        logger.error(f"Ошибка подключения к базе данных: {e}")
        raise

def get_stock_ids():
    """Получение списка ID акций из базы данных"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT id, symbol FROM stocks")
        return cur.fetchall()
    except Exception as e:
        logger.error(f"Ошибка при получении списка акций: {e}")
        raise
    finally:
        cur.close()
        conn.close()

def fetch_historical_data(symbol: str, period: str = "1y") -> Optional[pd.DataFrame]:
    """Получение исторических данных через yfinance"""
    try:
        stock = yf.Ticker(symbol)
        df = stock.history(period=period)
        return df
    except Exception as e:
        logger.error(f"Ошибка при получении исторических данных для {symbol}: {e}")
        return None

def save_historical_data(stock_id: int, symbol: str, df: pd.DataFrame):
    """Сохранение исторических данных в базу данных"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        for date, row in df.iterrows():
            # Формируем данные для сохранения
            raw_data = row.to_dict()
            processed_data = {
                'open': float(row['Open']),
                'high': float(row['High']),
                'low': float(row['Low']),
                'close': float(row['Close']),
                'volume': int(row['Volume']),
                'dividends': float(row.get('Dividends', 0)),
                'stock_splits': float(row.get('Stock Splits', 0))
            }
            
            # Сохраняем данные
            cur.execute("""
                INSERT INTO stock_data (stock_id, date, raw_data, processed_data, source)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (stock_id, date, source)
                DO UPDATE SET
                    raw_data = EXCLUDED.raw_data,
                    processed_data = EXCLUDED.processed_data,
                    created_at = CURRENT_TIMESTAMP
            """, (
                stock_id,
                date.date(),
                Json(raw_data),
                Json(processed_data),
                'yfinance'
            ))
        
        conn.commit()
        logger.info(f"Исторические данные для {symbol} успешно сохранены")
    except Exception as e:
        conn.rollback()
        logger.error(f"Ошибка при сохранении исторических данных для {symbol}: {e}")
        raise
    finally:
        cur.close()
        conn.close()

def main():
    """Основная функция для получения и сохранения исторических данных"""
    try:
        # Получаем список акций
        stock_ids = get_stock_ids()
        
        # Получаем и сохраняем исторические данные для каждой акции
        for stock_id, symbol in stock_ids:
            logger.info(f"Обработка исторических данных для {symbol}")
            
            # Получаем данные за последний год
            df = fetch_historical_data(symbol, period="1y")
            
            if df is not None and not df.empty:
                save_historical_data(stock_id, symbol, df)
            
            # Добавляем задержку между запросами
            time.sleep(1)
        
        logger.info("Обработка исторических данных завершена успешно")
    except Exception as e:
        logger.error(f"Произошла ошибка: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 