// src/pages/api/test-kma.ts (모든 문제 해결 최종본)
import type { NextApiRequest, NextApiResponse } from 'next';
import iconv from 'iconv-lite';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.KMA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: '기상청 API 키(KMA_API_KEY)가 설정되지 않았습니다.' });
  }

  const { time, stn } = req.query;

  if (!time || typeof time !== 'string' || !/^\d{12}$/.test(time)) {
    return res.status(400).json({ error: '시간 파라미터(time)가 필요하며, YYYYMMDDHHMM 형식의 12자리 숫자여야 합니다.' });
  }
  
  const stationId = (typeof stn === 'string' && stn) ? stn : '0';
  const requestTime = time;
  
  // help=0 으로 데이터만 요청
  const url = `https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php?tm=${requestTime}&stn=${stationId}&help=0&authKey=${apiKey}`;

  console.log('Requesting URL:', url);

  try {
    const response = await fetch(url, {
      // 1. 캐시(기억력) 문제 해결: 매번 새로운 데이터를 요청하도록 강제
      cache: 'no-store', 
      headers: {
        // 2. 신분증 문제 해결: 우리가 일반 브라우저인 것처럼 위장
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Referer": "http://localhost:3000/",
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 서버에서 에러가 발생했습니다: ${response.status} ${response.statusText}. 응답 내용: ${errorText}`);
    }

    const buffer = await response.arrayBuffer();
    const responseText = iconv.decode(Buffer.from(buffer), 'euc-kr');

    // 이전 버전의 파싱 로직은 정확했습니다. 그대로 사용합니다.
    const lines = responseText.trim().split('\n');
    const headersLineIndex = lines.findIndex(line => line.startsWith('#') && line.includes('YYMMDDHHMI') && line.includes('STN'));
    
    if (headersLineIndex === -1) {
      return res.status(200).json({
        source: "기상청 지상관측자료 API (데이터 포맷 오류 또는 데이터 없음)",
        data: [],
        raw_response: responseText,
      });
    }
    
    const headers = lines[headersLineIndex].replace('#', '').trim().split(/\s+/);
    const dataLines = lines.filter(line => !line.startsWith('#'));

    const jsonData = dataLines.map(line => {
      const values = line.trim().split(/\s+/);
      const entry: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        entry[header] = values[index];
      });
      return entry;
    });

    res.status(200).json({
      source: "기상청 지상관측자료 API",
      data: jsonData,
      raw_response: responseText,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 에러 발생';
    console.error('API 호출 중 에러:', error);
    res.status(500).json({ error: 'API 호출 중 서버 에러가 발생했습니다.', details: errorMessage });
  }
}