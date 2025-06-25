// src/pages/api/test-bok.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.BOK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
  }

  const url = `http://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/10/000Y001/M/202301/202312`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API 서버에서 에러가 발생했습니다: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.RESULT) {
      return res.status(400).json({
        message: '한국은행 API에서 에러 응답',
        details: data.RESULT,
      });
    }
    
    res.status(200).json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 에러 발생';
    console.error('API 호출 중 에러:', error);
    res.status(500).json({ error: 'API 호출 중 서버 에러가 발생했습니다.', details: errorMessage });
  }
}