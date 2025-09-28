import { useEffect, useState } from 'react';

interface SparklineProps {
  data: number[];
  className?: string;
}

export function Sparkline({ data, className = '' }: SparklineProps) {
  const [animatedData, setAnimatedData] = useState<number[]>([]);

  useEffect(() => {
    setAnimatedData(data);
  }, [data]);

  const maxValue = Math.max(...data, 1);

  return (
    <div className={`flex items-end gap-1 h-16 ${className}`}>
      {animatedData.map((value, index) => (
        <div
          key={index}
          className="sparkline-bar flex-1 min-w-[2px] rounded-t-sm"
          style={{
            height: `${(value / maxValue) * 100}%`,
            minHeight: '4px'
          }}
        />
      ))}
    </div>
  );
}