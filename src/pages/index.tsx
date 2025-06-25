// src/pages/index.tsx (한글 설명 추가 최종본)
import { useState } from 'react';

// STATIONS 데이터 (변경 없음)
const STATIONS = [ { stn: '90', name: '속초' }, { stn: '93', name: '북춘천' }, { stn: '95', name: '철원' }, { stn: '98', name: '동두천' }, { stn: '99', name: '파주' }, { stn: '100', name: '대관령' }, { stn: '101', name: '춘천' }, { stn: '102', name: '백령도' }, { stn: '104', name: '북강릉' }, { stn: '105', name: '강릉' }, { stn: '106', name: '동해' }, { stn: '108', name: '서울' }, { stn: '112', name: '인천' }, { stn: '114', name: '원주' }, { stn: '115', name: '울릉도' }, { stn: '119', name: '수원' }, { stn: '121', name: '영월' }, { stn: '127', name: '충주' }, { stn: '129', name: '서산' }, { stn: '130', name: '울진' }, { stn: '131', name: '청주' }, { stn: '133', name: '대전' }, { stn: '135', name: '추풍령' }, { stn: '136', name: '안동' }, { stn: '137', name: '상주' }, { stn: '138', name: '포항' }, { stn: '140', name: '군산' }, { stn: '143', name: '대구' }, { stn: '146', name: '전주' }, { stn: '152', name: '울산' }, { stn: '155', name: '창원' }, { stn: '156', name: '광주' }, { stn: '159', name: '부산' }, { stn: '162', name: '통영' }, { stn: '165', name: '목포' }, { stn: '168', name: '여수' }, { stn: '169', name: '흑산도' }, { stn: '170', name: '완도' }, { stn: '172', name: '고창' }, { stn: '174', name: '순천' }, { stn: '177', name: '홍성' }, { stn: '181', name: '성산' }, { stn: '184', name: '제주' }, { stn: '185', name: '고산' }, { stn: '188', name: '성산포' }, { stn: '189', name: '서귀포' }, { stn: '192', name: '진주' }, { stn: '201', name: '강화' }, { stn: '202', name: '양평' }, { stn: '203', name: '이천' }, { stn: '211', name: '인제' }, { stn: '212', name: '홍천' }, { stn: '216', name: '태백' }, { stn: '217', name: '정선군' }, { stn: '221', name: '제천' }, { stn: '226', name: '보은' }, { stn: '232', name: '천안' }, { stn: '235', name: '보령' }, { stn: '236', name: '부여' }, { stn: '238', name: '금산' }, { stn: '239', name: '세종' }, { stn: '243', name: '부안' }, { stn: '244', name: '임실' }, { stn: '245', name: '정읍' }, { stn: '247', name: '남원' }, { stn: '248', 'name': '장수' }, { stn: '251', name: '고창군' }, { stn: '252', name: '영광군' }, { stn: '254', name: '진도군' }, { stn: '255', name: '보성군' }, { stn: '257', name: '강진군' }, { stn: '258', name: '장흥' }, { stn: '259', name: '해남' }, { stn: '260', name: '고흥' }, { stn: '261', name: '의령군' }, { stn: '262', name: '함양군' }, { stn: '263', name: '산청' }, { stn: '264', name: '거창' }, { stn: '266', name: '합천' }, { stn: '268', name: '밀양' }, { stn: '271', name: '영주' }, { stn: '272', name: '문경' }, { stn: '273', name: '의성' }, { stn: '276', name: '구미' }, { stn: '277', name: '영천' }, { stn: '278', name: '경주시' }, { stn: '279', name: '거제' }, { stn: '281', name: '남해' }];

// --- 한글 설명 데이터 추가 ---
const FIELD_DESCRIPTIONS: { [key: string]: string } = {
  TM: '관측시각', STN: '지점번호', WD: '풍향(16방위)', WS: '풍속(m/s)',
  GST_WD: '돌풍향', GST_WS: '돌풍속(m/s)', GST_TM: '돌풍시각',
  PA: '현지기압(hPa)', PS: '해면기압(hPa)', PT: '기압변화경향',
  PR: '기압변화량(hPa)', TA: '기온(°C)', TD: '이슬점온도(°C)',
  HM: '상대습도(%)', PV: '수증기압(hPa)', RN: '강수량(mm)',
  RN_DAY: '일강수량(mm)', RN_JUN: '일강수량(전문)', RN_INT: '강수강도(mm/h)',
  SD_HR3: '3시간 신적설(cm)', SD_DAY: '일 신적설(cm)', SD_TOT: '총 적설(cm)',
  WC: '현재일기(GTS)', WP: '과거일기(GTS)', WW: '국내식 일기코드',
  CA_TOT: '전운량(1/10)', CA_MID: '중하층운량(1/10)', CH_MIN: '최저운고(100m)',
  CT: '운형', CT_TOP: '상층운형(GTS)', CT_MID: '중층운형(GTS)', CT_LOW: '하층운형(GTS)',
  VS: '시정(10m)', SS: '일조(hr)', SI: '일사(MJ/m2)',
  ST_GD: '지면상태', TS: '지면온도(°C)',
  TE_005: '5cm 지중온도(°C)', TE_01: '10cm 지중온도(°C)',
  TE_02: '20cm 지중온도(°C)', TE_03: '30cm 지중온도(°C)',
  ST_SEA: '해면상태', WH: '파고(m)', BF: '최대풍력(Beaufart)',
  IR: '강수자료 유무', IX: '관측방식'
};

// 인터페이스 및 컴포넌트 정의 (변경 없음)
interface StationData { [key: string]: string; }
interface KmaApiResponse { source: string; data: StationData[]; raw_response: string; }
const LoadingSpinner = () => ( <div className="flex justify-center items-center p-8"><svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span className="text-lg text-gray-700">데이터를 불러오는 중입니다...</span></div>);

// --- StationCard 컴포넌트 수정 ---
const StationCard = ({ station }: { station: StationData }) => {
  const displayEntries = Object.entries(station).filter(
    ([key]) => key !== 'STN' && key !== 'YYMMDDHHMI'
  );

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 border border-gray-100 flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">
        관측소 (STN): <span className="text-blue-600">{station.STN}</span>
      </h3>
      <div className="mt-3 flex-grow overflow-hidden">
        <dl className="space-y-1">
          {displayEntries.map(([key, value]) => {
            const description = FIELD_DESCRIPTIONS[key] || key; // 한글 설명이 없으면 원래 키 값을 사용
            const isNA = value.trim().startsWith('-9');
            
            return (
              <div key={key} className="grid grid-cols-2 gap-2 text-sm py-1.5 px-2 odd:bg-gray-50 rounded-md">
                <dt className="text-gray-500 truncate" title={description}>
                  {description}
                </dt>
                <dd className="text-gray-800 font-semibold text-right">
                  {isNA ? (
                    <span className="text-gray-400">N/A</span>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
};

const formatDateForInput = (date: Date) => { const pad = (num: number) => num.toString().padStart(2, '0'); const yyyy = date.getFullYear(); const MM = pad(date.getMonth() + 1); const dd = pad(date.getDate()); const hh = pad(date.getHours()); const mm = pad(date.getMinutes()); return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;};
interface LastRequestParams { time: string; stn: string; help: string; }

export default function HomePage() {
  const [data, setData] = useState<KmaApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedDateTime, setSelectedDateTime] = useState(() => { const oneHourAgo = new Date(); oneHourAgo.setHours(oneHourAgo.getHours() - 1); oneHourAgo.setMinutes(0); oneHourAgo.setSeconds(0); return formatDateForInput(oneHourAgo); });
  const [stationId, setStationId] = useState('108');
  
  const [lastRequestParams, setLastRequestParams] = useState<LastRequestParams | null>(null);

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    const requestTime = selectedDateTime.replace(/[-T:]/g, '');
    const params = { time: requestTime, stn: stationId, help: '0' };
    setLastRequestParams(params);
    try {
      const response = await fetch(`/api/test-kma?time=${params.time}&stn=${params.stn}`);
      const result = await response.json();
      if (!response.ok) { throw new Error(result.error || '알 수 없는 에러가 발생했습니다.'); }
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는 데 실패했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            기상청 API 테스터
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            전국 지상 관측(AWS/ASOS) 자료를 조회합니다.
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-grow">
                <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-2">
                  조회 시각 선택
                </label>
                <input type="datetime-local" id="datetime" value={selectedDateTime} onChange={(e) => setSelectedDateTime(e.target.value)} className="appearance-none mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 text-base focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              <div className="w-full sm:w-48">
                 <label htmlFor="station" className="block text-sm font-medium text-gray-700 mb-2">지점 선택</label>
                 <select id="station" value={stationId} onChange={(e) => setStationId(e.target.value)} className="appearance-none mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 text-base bg-white focus:border-blue-500 focus:ring-blue-500">
                   {STATIONS.map((station) => ( <option key={station.stn} value={station.stn}>{station.name} ({station.stn})</option> ))}
                 </select>
              </div>

              <button onClick={handleFetchData} disabled={loading} className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                {loading ? '호출 중...' : '데이터 조회'}
              </button>
            </div>
          </div>
          
          {lastRequestParams && !loading && ( <div className="mb-8 p-4 bg-slate-100 border border-slate-300 rounded-lg shadow-sm"><h3 className="font-semibold text-slate-800">마지막 요청 정보:</h3><div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm"><p><strong>time:</strong> <span className="font-mono bg-slate-200 text-slate-800 px-2 py-1 rounded">{lastRequestParams.time}</span></p><p><strong>stn:</strong> <span className="font-mono bg-slate-200 text-slate-800 px-2 py-1 rounded">{lastRequestParams.stn}</span></p><p><strong>help:</strong> <span className="font-mono bg-slate-200 text-slate-800 px-2 py-1 rounded">{lastRequestParams.help}</span></p></div></div> )}
          
          <div className="mt-8">
            {loading && <LoadingSpinner />}
            {error && ( <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md"><h3 className="font-bold">에러 발생!</h3><p className="break-all">{error}</p></div> )}
            {data && !loading && ( <div>{data.data.length === 0 ? ( <div className="text-center p-8 bg-white rounded-lg shadow"><h3 className="text-lg font-medium text-gray-900">데이터 없음</h3><p className="mt-1 text-sm text-gray-500">선택하신 시각/지점에 해당하는 데이터가 없습니다. 다른 조건으로 다시 시도해주세요.</p></div>) : ( <> <h2 className="text-2xl font-semibold text-gray-800 mb-4">조회 결과: 총 {data.data.length}개 관측소</h2> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{data.data.map((station) => ( <StationCard key={station.STN} station={station} /> ))}</div> <details className="mt-10 bg-white p-4 rounded-lg shadow-inner border"><summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">원본 응답 데이터 보기 (Raw Response)</summary><pre className="mt-4 p-4 bg-gray-900 text-white rounded-lg overflow-x-auto text-xs">{data.raw_response}</pre></details> </> )}</div> )}
          </div>
        </div>
      </main>
    </div>
  );
}