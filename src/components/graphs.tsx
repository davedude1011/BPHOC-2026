import { SolidApexCharts } from "solid-apexcharts";
import { createEffect, createMemo, createSignal, type Accessor } from "solid-js";

export function DistributionGraph({ raw }: { raw: Accessor<number[]> }) {
    const chart_data = createMemo(() => {
        const counts: Record<number, number> = {};
        for (const num of raw()) {
            const sf1 = Number(num.toPrecision(1));
            if (!counts[sf1]) counts[sf1] = 0;
            counts[sf1] += 1;
        }
        
        const categories = Object.keys(counts)
            .map(key => Number(key))
            .sort((a, b) => a - b);
        const data = categories.map(key => counts[key]);

        return { categories, data };
    })

    const options = {
        chart: {
            type: "bar",
            animation: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "60%",
            },
        },
        stroke: {
            curve: "smooth",
        },
        xaxis: {
            categories: chart_data().categories,
        },
        theme: {
            monochrome: {
                enabled: true,
                color: "#4f46e5",
            },
        },
    } as const;

    const series = () => [{
        name: "frequency",
        data: chart_data().data,
    }];

    return (
        <div class="p-4 bg-white rounded-lg shadow">
            <SolidApexCharts width="100%" type="bar" options={options} series={series()} />
        </div>
    )
}

export function StatCard(props: { label: string, value: number }) {
  const [displayValue, setDisplayValue] = createSignal(0);

  // Smoothly interpolate the number (Simple version)
  createEffect(() => {
    const target = props.value;
    const interval = setInterval(() => {
      setDisplayValue(prev => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.1) {
            clearInterval(interval);
            return target;
        }
        return prev + diff * 0.1; // Smooth easing factor
      });
    }, 16);
    return () => clearInterval(interval);
  });

  return (
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-1 w-48">
      <span class="text-slate-500 text-xs font-semibold uppercase tracking-wider">
        {props.label}
      </span>
      <div class="flex items-baseline gap-1">
        <span class="text-3xl font-bold text-slate-900">
          {displayValue().toFixed(1)}
        </span>
        <span class="text-indigo-600 font-medium text-sm">px</span>
      </div>
      {/* Optional: A tiny sparkline could go here */}
      <div class="h-1 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
        <div 
          class="h-full bg-indigo-500 transition-all duration-500 ease-out" 
          style={{ width: `${Math.min((displayValue() / 1000) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}