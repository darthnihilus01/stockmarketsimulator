import type { Candle, ChartType } from '@/types';

function parseTime(timeStr: string): Date {
  const now = new Date();
  const parts = timeStr.split(':');
  now.setHours(parseInt(parts[0] || '0'), parseInt(parts[1] || '0'), parseInt(parts[2] || '0'), 0);
  return now;
}

export function buildChartOptions(
  history: Candle[],
  chartType: ChartType,
  _timeframe: string, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  if (history.length === 0) return {};

  const times = history.map((c) => parseTime(c.time).getTime());

  const priceData = history.map((c, i) => [times[i], c.close] as [number, number]);
  const ohlcData = history.map((c, i) => [times[i], c.open, c.high, c.low, c.close] as [number, number, number, number, number]);
  const volumeData = history.map((c, i) => [times[i], c.volume] as [number, number]);

  const priceValues = history.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);
  const padding = (maxPrice - minPrice) * 0.05 || maxPrice * 0.02;

  return {
    backgroundColor: '#050505',
    animation: false,
    grid: [
      {
        top: 8,
        bottom: '24%',
        left: 4,
        right: 56,
      },
      {
        top: '79%',
        bottom: 4,
        left: 4,
        right: 56,
      },
    ],
    xAxis: [
      {
        type: 'time',
        gridIndex: 0,
        axisLine: { lineStyle: { color: '#2B2B2B' } },
        axisTick: { lineStyle: { color: '#2B2B2B' } },
        axisLabel: { show: false },
        splitLine: { show: true, lineStyle: { color: '#2B2B2B', width: 1 } },
      },
      {
        type: 'time',
        gridIndex: 1,
        axisLine: { lineStyle: { color: '#2B2B2B' } },
        axisTick: { lineStyle: { color: '#2B2B2B' } },
        axisLabel: {
          color: '#9E9E9E',
          fontSize: 10,
          fontFamily: 'monospace',
          hideOverlap: true,
        },
        splitLine: { show: false },
      },
    ],
    yAxis: [
      {
        type: 'value',
        gridIndex: 0,
        position: 'right',
        min: minPrice - padding,
        max: maxPrice + padding,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#9E9E9E',
          fontSize: 10,
          fontFamily: 'monospace',
          padding: [0, 4, 0, 0],
        },
        splitLine: { show: true, lineStyle: { color: '#2B2B2B', width: 1 } },
      },
      {
        type: 'value',
        gridIndex: 1,
        position: 'right',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: '#0E0E0E',
      borderColor: '#2B2B2B',
      borderWidth: 1,
      textStyle: { color: '#D6D6D6', fontSize: 11, fontFamily: 'monospace' },
      formatter: (params: unknown) => {
        const arr = params as { axisValueLabel: string; seriesName: string; value: number[] }[];
        if (!arr || arr.length === 0) return '';
        const p = arr[0];
        const date = p.axisValueLabel;
        if (chartType === 'line') {
          const v = arr.find((a) => a.seriesName === 'Price');
          return `<div style="font-size:11px;font-family:monospace">
            <span style="color:#9E9E9E">${date}</span><br/>
            <span style="color:#D6D6D6">Price: </span><span style="color:#FFFFFF;font-weight:bold">$${v ? (v.value[1] as number).toFixed(2) : '-'}</span>
          </div>`;
        }
        const ohlc = arr.find((a) => a.seriesName === 'OHLC');
        const vol = arr.find((a) => a.seriesName === 'Volume');
        if (!ohlc) return '';
        const v = ohlc.value;
        return `<div style="font-size:11px;font-family:monospace">
          <span style="color:#9E9E9E">${date}</span><br/>
          <span style="color:#9E9E9E">O: </span><span style="color:#D6D6D6">$${(v[1] as number).toFixed(2)}</span><br/>
          <span style="color:#9E9E9E">H: </span><span style="color:#D6D6D6">$${(v[2] as number).toFixed(2)}</span><br/>
          <span style="color:#9E9E9E">L: </span><span style="color:#D6D6D6">$${(v[3] as number).toFixed(2)}</span><br/>
          <span style="color:#9E9E9E">C: </span><span style="color:#D6D6D6">$${(v[4] as number).toFixed(2)}</span><br/>
          ${vol ? `<span style="color:#9E9E9E">Vol: </span><span style="color:#D6D6D6">${(vol.value[1] as number).toLocaleString()}</span>` : ''}
        </div>`;
      },
    },
    axisPointer: {
      link: [{ xAxisIndex: [0, 1] }],
      label: {
        backgroundColor: '#1A1A1A',
        borderColor: '#2B2B2B',
        borderWidth: 1,
        color: '#D6D6D6',
        fontSize: 10,
        fontFamily: 'monospace',
        padding: [2, 6],
      },
    },
    series: [
      chartType === 'line'
        ? {
            name: 'Price',
            type: 'line',
            data: priceData,
            symbol: 'circle',
            symbolSize: priceData.length > 0 ? 4 : 0,
            showSymbol: false,
            smooth: false,
            lineStyle: { color: '#D6D6D6', width: 2 },
            areaStyle: {
              color: '#17395F',
              opacity: 0.3,
            },
            markPoint: {
              symbol: 'circle',
              symbolSize: 6,
              data: priceData.length > 0
                ? [{ coord: priceData[priceData.length - 1], itemStyle: { color: '#FFFFFF' } }]
                : [],
              label: {
                show: priceData.length > 0,
                position: 'right',
                color: '#FFFFFF',
                fontSize: 11,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                formatter: () => {
                  const last = priceData[priceData.length - 1];
                  return last ? `$${last[1].toFixed(2)}` : '';
                },
              },
            },
          }
        : {
            name: 'OHLC',
            type: 'candlestick',
            data: ohlcData.map((ohlc) => ohlc.slice(1)),
            itemStyle: {
              color: '#22C55E',
              color0: '#EF4444',
              borderColor: '#22C55E',
              borderColor0: '#EF4444',
              borderWidth: 1,
            },
          },
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumeData,
        itemStyle: { color: '#5F7393' },
        barMaxWidth: 8,
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 0,
        end: 100,
      },
    ],
  };
}
