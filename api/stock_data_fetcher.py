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
        logging.FileHandler('stock_data_fetcher.log'),
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

# Список основных акций для отслеживания
MAJOR_STOCKS = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'V', 'WMT',
    'PG', 'MA', 'HD', 'CVX', 'LLY', 'KO', 'PFE', 'BAC', 'PEP', 'COST',
    'DHR', 'ABBV', 'TMO', 'CSCO', 'MRK', 'ABT', 'VZ', 'ACN', 'CRM', 'NEE'
]

def get_db_connection():
    """Создание подключения к базе данных"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        logger.error(f"Ошибка подключения к базе данных: {e}")
        raise

def create_tables():
    """Создание необходимых таблиц в базе данных"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Создание таблицы stocks
        cur.execute("""
            CREATE TABLE IF NOT EXISTS stocks (
                id SERIAL PRIMARY KEY,
                symbol VARCHAR(20) NOT NULL UNIQUE,
                name VARCHAR(255) NOT NULL,
                exchange VARCHAR(50) NOT NULL,
                sector VARCHAR(100),
                industry VARCHAR(100),
                country VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Создание таблицы stock_data
        cur.execute("""
            CREATE TABLE IF NOT EXISTS stock_data (
                id SERIAL PRIMARY KEY,
                stock_id INTEGER REFERENCES stocks(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                raw_data JSONB NOT NULL,
                processed_data JSONB NOT NULL,
                source VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(stock_id, date, source)
            )
        """)
        
        # Создание индексов
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
            CREATE INDEX IF NOT EXISTS idx_stocks_sector ON stocks(sector);
            CREATE INDEX IF NOT EXISTS idx_stock_data_stock_id_date ON stock_data(stock_id, date);
            CREATE INDEX IF NOT EXISTS idx_stock_data_source ON stock_data(source);
        """)
        
        conn.commit()
        logger.info("Таблицы успешно созданы")
    except Exception as e:
        conn.rollback()
        logger.error(f"Ошибка при создании таблиц: {e}")
        raise
    finally:
        cur.close()
        conn.close()

def fetch_stock_info(symbol: str) -> Optional[Dict[str, Any]]:
    """Получение информации о акции через yfinance"""
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        
        return {
            'symbol': symbol,
            'name': info.get('longName', ''),
            'exchange': info.get('exchange', ''),
            'sector': info.get('sector', ''),
            'industry': info.get('industry', ''),
            'country': info.get('country', ''),
            'raw_data': info
        }
    except Exception as e:
        logger.error(f"Ошибка при получении информации о {symbol}: {e}")
        return None

def save_stock_info(stock_info: Dict[str, Any]):
    """Сохранение информации о акции в базу данных"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Проверяем существование акции
        cur.execute("SELECT id FROM stocks WHERE symbol = %s", (stock_info['symbol'],))
        result = cur.fetchone()
        
        if result:
            # Обновляем существующую запись
            cur.execute("""
                UPDATE stocks 
                SET name = %s, exchange = %s, sector = %s, industry = %s, country = %s, updated_at = CURRENT_TIMESTAMP
                WHERE symbol = %s
                RETURNING id
            """, (
                stock_info['name'], stock_info['exchange'], stock_info['sector'],
                stock_info['industry'], stock_info['country'], stock_info['symbol']
            ))
            stock_id = cur.fetchone()[0]
        else:
            # Создаем новую запись
            cur.execute("""
                INSERT INTO stocks (symbol, name, exchange, sector, industry, country)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                stock_info['symbol'], stock_info['name'], stock_info['exchange'],
                stock_info['sector'], stock_info['industry'], stock_info['country']
            ))
            stock_id = cur.fetchone()[0]
        
        # Сохраняем сырые данные
        cur.execute("""
            INSERT INTO stock_data (stock_id, date, raw_data, processed_data, source)
            VALUES (%s, CURRENT_DATE, %s, %s, %s)
            ON CONFLICT (stock_id, date, source)
            DO UPDATE SET
                raw_data = EXCLUDED.raw_data,
                processed_data = EXCLUDED.processed_data,
                created_at = CURRENT_TIMESTAMP
        """, (
            stock_id,
            Json(stock_info['raw_data']),
            Json(stock_info['raw_data']),  # В данном случае processed_data совпадает с raw_data
            'yfinance'
        ))
        
        conn.commit()
        logger.info(f"Информация о {stock_info['symbol']} успешно сохранена")
    except Exception as e:
        conn.rollback()
        logger.error(f"Ошибка при сохранении информации о {stock_info['symbol']}: {e}")
        raise
    finally:
        cur.close()
        conn.close()

def main():
    """Основная функция для получения и сохранения данных"""
    try:
        # Создаем таблицы, если они не существуют
        create_tables()
        
        # Получаем и сохраняем информацию о каждой акции
        for symbol in MAJOR_STOCKS:
            logger.info(f"Обработка акции {symbol}")
            stock_info = fetch_stock_info(symbol)
            
            if stock_info:
                save_stock_info(stock_info)
            
            # Добавляем задержку между запросами
            time.sleep(1)
        
        logger.info("Обработка завершена успешно")
    except Exception as e:
        logger.error(f"Произошла ошибка: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 