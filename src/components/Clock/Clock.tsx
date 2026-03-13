import { useState, useEffect, useRef, useCallback } from 'react';
import './Clock.css';

export interface ClockWidgetConfig {
  hourCycle?: 'h12' | 'h24';
  showSeconds?: boolean;
  showDate?: boolean;
}

interface ClockWidgetState {
  currentTime: Date;
  timeZone: string;
  locale: string;
}

const DEFAULT_CONFIG: Required<ClockWidgetConfig> = {
  hourCycle: 'h24',
  showSeconds: true,
  showDate: true,
};

export default function Clock(props: ClockWidgetConfig) {
  const config: Required<ClockWidgetConfig> = {
    ...DEFAULT_CONFIG,
    ...props,
  };

  const [state, setState] = useState<ClockWidgetState>(() => ({
    currentTime: new Date(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: navigator.language || 'zh-CN',
  }));

  const prevMinuteRef = useRef<number>(state.currentTime.getMinutes());
  const [ariaTimeLabel, setAriaTimeLabel] = useState<string>('');

  const formatTime = useCallback(
    (date: Date, locale: string, timeZone: string): string => {
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: config.hourCycle === 'h12' ? 'h12' : 'h23',
        timeZone,
      };
      if (config.showSeconds) {
        options.second = '2-digit';
      }
      return new Intl.DateTimeFormat(locale, options).format(date);
    },
    [config.hourCycle, config.showSeconds]
  );

  const formatDate = useCallback(
    (date: Date, locale: string, timeZone: string): string => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timeZone,
      };
      return new Intl.DateTimeFormat(locale, options).format(date);
    },
    []
  );

  const formatAriaLabel = useCallback(
    (date: Date, locale: string, timeZone: string): string => {
      const timeStr = formatTime(date, locale, timeZone);
      const dateStr = formatDate(date, locale, timeZone);
      return `当前时间 ${timeStr}，${dateStr}`;
    },
    [formatTime, formatDate]
  );

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = navigator.language || 'zh-CN';

      setState({
        currentTime: now,
        timeZone,
        locale,
      });

      const currentMinute = now.getMinutes();
      if (currentMinute !== prevMinuteRef.current) {
        prevMinuteRef.current = currentMinute;
        setAriaTimeLabel(formatAriaLabel(now, locale, timeZone));
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [formatAriaLabel]);

  const { currentTime, locale, timeZone } = state;
  const timeString = formatTime(currentTime, locale, timeZone);
  const dateString = config.showDate
    ? formatDate(currentTime, locale, timeZone)
    : '';

  return (
    <div
      className="clock-widget"
      role="timer"
      aria-label={ariaTimeLabel || formatAriaLabel(currentTime, locale, timeZone)}
    >
      <div className="clock-widget__time" aria-hidden="true">
        {timeString}
      </div>
      {config.showDate && (
        <div className="clock-widget__date" aria-hidden="true">
          {dateString}
        </div>
      )}
      <div className="clock-widget__timezone" aria-hidden="true">
        {timeZone}
      </div>
      {/* Screen reader polite announcement — only updates on minute change */}
      <div className="sr-only" aria-live="polite" role="status">
        {ariaTimeLabel}
      </div>
    </div>
  );
}
