import { useState, useEffect } from 'react';
import { getDataSource, DATA_SOURCES } from '../config/dataSourceConfig';
import { MOCK_DATA } from '../constants/mockData';

// Hook para acceder a la configuración de fuente de datos
export function useDataSource() {
  const [source, setSource] = useState(() => getDataSource());

  useEffect(() => {
    const handleSourceChanged = (event) => {
      setSource(event.detail.source);
    };

    window.addEventListener('dataSourceChanged', handleSourceChanged);
    return () => window.removeEventListener('dataSourceChanged', handleSourceChanged);
  }, []);

  const isMock = source === DATA_SOURCES.MOCK;
  const isReal = source === DATA_SOURCES.REAL;

  return {
    source,
    isMock,
    isReal,
    mockData: MOCK_DATA,
  };
}
