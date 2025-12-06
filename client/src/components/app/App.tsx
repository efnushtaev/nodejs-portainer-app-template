import { useState, useEffect, useRef } from 'react';
import { formatDate, getZhamLabel } from '../../utils';
import { API_URLS, TIMESTAMP_MOCK } from '../constants';

export const App = () => {
  const [timestamp, setTimestamp] = useState(TIMESTAMP_MOCK);
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  // Refs для хранения значений между рендерами
  const counterRef = useRef(11);
  const currentTimestampRef = useRef(new Date(timestamp).getTime());

  useEffect(() => {
    const fetchTimestamp = async () => {
      if (counterRef.current < 10) {
        // Локальное обновление времени
        currentTimestampRef.current += 1000;
        setTimestamp(new Date(currentTimestampRef.current).toISOString());
        counterRef.current++;
      } else {
        // Сброс и запрос к серверу
        counterRef.current = 0;
        try {
          const response = await fetch(API_URLS.getTimestamp);
          const data = await response.json();
          const serverTime = new Date(data.timestamp).getTime();
          currentTimestampRef.current = serverTime;
          setTimestamp(data.timestamp);
        } catch (error) {
          console.error('Error fetching timestamp:', error);
          currentTimestampRef.current += 1000;
        }
      }
    };

    // Запускаем сразу и затем каждую секунду
    fetchTimestamp();
    const interval = setInterval(fetchTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  // Эффект для загрузки начального количества кликов
  useEffect(() => {
    const fetchClicks = async () => {
      setIsDisabled(true);
      try {
        const response = await fetch(API_URLS.getCount);
        const data = await response.json();
        setClickCount(data[0].count_value);
      } catch (error) {
        console.error('Error fetching clicks:', error);
      } finally {
        setIsLoading(false);
        setIsDisabled(false);
      }
    };

    fetchClicks();
  }, []);

  // Обработчик клика
  const handleOnClick = async () => {
    if (isDisabled) return;

    setIsDisabled(true);
    try {
      const response = await fetch(API_URLS.count, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ count: clickCount })
      });
      const data = await response.json();
      setClickCount(data.item.count_value);
    } catch (error) {
      console.error('Error sending click:', error);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className='wrapper'>
      <div>
        <h1>Время сервера:</h1>
        <p>{formatDate(timestamp)}</p>
        <div className='rotate-scale-up' />
      </div>
      <div>
        <div
          aria-disabled={isDisabled}
          className='click-me'
          onClick={handleOnClick}
        >
          <h1>{isLoading ? '...' : clickCount}</h1>
          <h2>{getZhamLabel(clickCount)}</h2>
        </div>
      </div>
    </div>
  );
}