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
        logging.FileHandler('financial_data_fetcher.log'),
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

def fetch_financial_data(symbol: str) -> Optional[Dict[str, Any]]:
    """Получение финансовых показателей через yfinance"""
    try:
        stock = yf.Ticker(symbol)
        
        # Получаем различные финансовые показатели
        info = stock.info
        financials = stock.financials
        balance_sheet = stock.balance_sheet
        cash_flow = stock.cashflow
        earnings = stock.earnings
        
        return {
            'symbol': symbol,
            'info': info,
            'financials': financials.to_dict() if financials is not None else {},
            'balance_sheet': balance_sheet.to_dict() if balance_sheet is not None else {},
            'cash_flow': cash_flow.to_dict() if cash_flow is not None else {},
            'earnings': earnings.to_dict() if earnings is not None else {}
        }
    except Exception as e:
        logger.error(f"Ошибка при получении финансовых данных для {symbol}: {e}")
        return None

def save_financial_data(stock_id: int, symbol: str, data: Dict[str, Any]):
    """Сохранение финансовых данных в базу данных"""
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Формируем обработанные данные
        processed_data = {
            'financial_ratios': {
                'pe_ratio': data['info'].get('forwardPE'),
                'price_to_book': data['info'].get('priceToBook'),
                'price_to_sales': data['info'].get('priceToSalesTrailing12Months'),
                'dividend_yield': data['info'].get('dividendYield'),
                'profit_margins': data['info'].get('profitMargins'),
                'operating_margins': data['info'].get('operatingMargins'),
                'return_on_equity': data['info'].get('returnOnEquity'),
                'return_on_assets': data['info'].get('returnOnAssets'),
                'debt_to_equity': data['info'].get('debtToEquity'),
                'current_ratio': data['info'].get('currentRatio'),
                'beta': data['info'].get('beta')
            },
            'market_data': {
                'market_cap': data['info'].get('marketCap'),
                'enterprise_value': data['info'].get('enterpriseValue'),
                'trailing_pe': data['info'].get('trailingPE'),
                'forward_pe': data['info'].get('forwardPE'),
                'peg_ratio': data['info'].get('pegRatio'),
                'price_to_sales': data['info'].get('priceToSalesTrailing12Months'),
                'price_to_book': data['info'].get('priceToBook'),
                'enterprise_to_revenue': data['info'].get('enterpriseToRevenue'),
                'enterprise_to_ebitda': data['info'].get('enterpriseToEbitda')
            },
            'dividend_data': {
                'dividend_rate': data['info'].get('dividendRate'),
                'dividend_yield': data['info'].get('dividendYield'),
                'payout_ratio': data['info'].get('payoutRatio'),
                'five_year_avg_dividend_yield': data['info'].get('fiveYearAvgDividendYield')
            }
        }
        
        # Сохраняем данные
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
            Json(data),
            Json(processed_data),
            'yfinance_financials'
        ))
        
        conn.commit()
        logger.info(f"Финансовые данные для {symbol} успешно сохранены")
    except Exception as e:
        conn.rollback()
        logger.error(f"Ошибка при сохранении финансовых данных для {symbol}: {e}")
        raise
    finally:
        cur.close()
        conn.close()

def main():
    """Основная функция для получения и сохранения финансовых данных"""
    try:
        # Получаем список акций
        stock_ids = get_stock_ids()
        
        # Получаем и сохраняем финансовые данные для каждой акции
        for stock_id, symbol in stock_ids:
            logger.info(f"Обработка финансовых данных для {symbol}")
            
            data = fetch_financial_data(symbol)
            if data:
                save_financial_data(stock_id, symbol, data)
            
            # Добавляем задержку между запросами
            time.sleep(1)
        
        logger.info("Обработка финансовых данных завершена успешно")
    except Exception as e:
        logger.error(f"Произошла ошибка: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 