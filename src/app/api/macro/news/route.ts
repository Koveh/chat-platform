import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Создаем пул соединений с базой данных
const pool = new Pool({
  user: process.env.DB_USER || 'investmentskoveh',
  password: process.env.DB_PASSWORD || 'Daniil77Daniil',
  host: 'localhost',
  port: 5432,
  database: process.env.DB_NAME || 'investments-koveh',
});

// Обработчик GET-запроса для получения новостей
export async function GET(request: NextRequest) {
  try {
    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Получаем параметры фильтров
    const importance = searchParams.get('importance');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const sources = searchParams.get('sources');
    const sentiment = searchParams.get('sentiment');
    const politicalBias = searchParams.get('politicalBias');
    
    // Строим SQL-запрос с учетом фильтров
    let queryParams: any[] = [];
    let whereConditions: string[] = [];
    
    // Добавляем условия фильтрации
    if (importance) {
      queryParams.push(parseInt(importance) / 2); // Преобразуем обратно в шкалу reliability_score
      whereConditions.push(`reliability_score >= $${queryParams.length}`);
    }
    
    if (dateFrom) {
      queryParams.push(dateFrom);
      whereConditions.push(`publication_date >= $${queryParams.length}`);
    }
    
    if (dateTo) {
      queryParams.push(dateTo);
      whereConditions.push(`publication_date <= $${queryParams.length}`);
    }
    
    if (sources) {
      const sourcesList = sources.split(',');
      const placeholders = sourcesList.map((_, index) => `$${queryParams.length + index + 1}`).join(', ');
      queryParams.push(...sourcesList);
      whereConditions.push(`news_agency IN (${placeholders})`);
    }
    
    if (sentiment) {
      const isPositive = sentiment === 'positive';
      queryParams.push(isPositive);
      whereConditions.push(`is_positive = $${queryParams.length}`);
    }
    
    if (politicalBias) {
      queryParams.push(politicalBias);
      whereConditions.push(`political_bias = $${queryParams.length}`);
    }
    
    // Формируем WHERE часть запроса
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Получаем общее количество новостей для пагинации с учетом фильтров
    const countQuery = `SELECT COUNT(*) FROM news ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].count);
    
    // Добавляем параметры для LIMIT и OFFSET
    queryParams.push(limit, offset);
    
    // Выполняем запрос к базе данных с пагинацией и фильтрацией
    const query = `
      SELECT id, news_agency, country, political_bias, reliability, title, link, publication_date, content, reliability_score, is_positive, news_style, created_at 
      FROM news 
      ${whereClause} 
      ORDER BY publication_date DESC NULLS LAST 
      LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
    `;
    
    const result = await pool.query(query, queryParams);
    
    // Преобразуем данные в формат, ожидаемый клиентом
    const formattedNews = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content || 'Содержание отсутствует',
      date: row.publication_date ? new Date(row.publication_date).toISOString() : new Date(row.created_at).toISOString(),
      source: row.news_agency,
      category: row.news_style || 'Не указано',
      url: row.link,
      country: row.country || 'Не указано',
      importance: Math.round((row.reliability_score || 5) * 2), // Преобразуем reliability_score в шкалу от 0 до 10
      sentiment: row.is_positive ? 'positive' : 'negative',
      reliability: row.reliability || 'Не указано',
      politicalBias: row.political_bias || 'Не указано',
    }));
    
    // Возвращаем результат с информацией о пагинации
    return NextResponse.json({
      success: true,
      data: formattedNews,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Ошибка при получении новостей:', error);
    
    // Возвращаем ошибку
    return NextResponse.json(
      {
        success: false,
        error: 'Ошибка при получении новостей',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 