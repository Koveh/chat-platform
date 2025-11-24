import os
import sys
import logging
import subprocess
from datetime import datetime

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('run_fetchers.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

def run_script(script_name: str):
    """Запуск Python-скрипта"""
    try:
        logger.info(f"Запуск скрипта {script_name}")
        result = subprocess.run([sys.executable, script_name], capture_output=True, text=True)
        
        if result.returncode == 0:
            logger.info(f"Скрипт {script_name} успешно завершен")
            if result.stdout:
                logger.info(f"Вывод скрипта:\n{result.stdout}")
        else:
            logger.error(f"Ошибка при выполнении скрипта {script_name}")
            if result.stderr:
                logger.error(f"Ошибка:\n{result.stderr}")
    except Exception as e:
        logger.error(f"Ошибка при запуске скрипта {script_name}: {e}")

def main():
    """Основная функция для запуска всех фетчеров"""
    try:
        # Получаем путь к директории со скриптами
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Список скриптов для запуска
        scripts = [
            'stock_data_fetcher.py',
            'historical_data_fetcher.py',
            'financial_data_fetcher.py'
        ]
        
        # Запускаем каждый скрипт
        for script in scripts:
            script_path = os.path.join(script_dir, script)
            if os.path.exists(script_path):
                run_script(script_path)
            else:
                logger.error(f"Скрипт {script} не найден")
        
        logger.info("Все фетчеры успешно завершены")
    except Exception as e:
        logger.error(f"Произошла ошибка: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 