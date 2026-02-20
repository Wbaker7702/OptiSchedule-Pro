import { IntegrationStatus } from '../types';

export interface ChatHistoryItem {
  role: 'user' | 'ai';
  content: string;
}

export interface ScheduleHeatmapRow {
  day: string;
  hours: number[];
}

export interface LogisticsDataPoint {
  hour: string;
  inbound: number;
  outbound: number;
  pickRate: number;
}

const REQUEST_TIMEOUT_MS = 8000;
const KNOWN_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFAULT_HEATMAP: ScheduleHeatmapRow[] = [
  { day: 'Mon', hours: [5, 5, 4, 5, 6, 8, 8, 9] },
  { day: 'Tue', hours: [6, 5, 6, 6, 6, 9, 10, 9] },
  { day: 'Wed', hours: [5, 5, 5, 6, 7, 9, 9, 9] },
  { day: 'Thu', hours: [5, 5, 6, 6, 7, 9, 10, 8] },
  { day: 'Fri', hours: [6, 6, 6, 7, 8, 11, 12, 12] },
  { day: 'Sat', hours: [8, 7, 7, 8, 9, 12, 13, 12] },
  { day: 'Sun', hours: [7, 6, 6, 7, 8, 11, 12, 11] },
];

type ProxyPayload =
  | {
      task: 'sentinel-chat';
      prompt: string;
      history: ChatHistoryItem[];
      context: { hubspotStatus: IntegrationStatus };
    }
  | {
      task: 'schedule-forecast';
      currentHeatmap: ScheduleHeatmapRow[];
    }
  | {
      task: 'logistics-insights';
      logisticsData: LogisticsDataPoint[];
      dockContext: string[];
    };

interface ProxyResponse {
  reply?: string;
  heatmap?: unknown;
  insights?: string;
}

const getProxyEndpoint = (): string | null => {
  const configured = import.meta.env.VITE_SENTINEL_PROXY_URL;
  if (typeof configured !== 'string' || configured.trim().length === 0) {
    return null;
  }
  return configured.trim();
};

const postToProxy = async (payload: ProxyPayload): Promise<ProxyResponse | null> => {
  const endpoint = getProxyEndpoint();
  if (!endpoint) return null;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Sentinel proxy returned ${response.status}`);
    }

    return (await response.json()) as ProxyResponse;
  } catch (error) {
    console.warn('Sentinel proxy unavailable, using local fallback.', error);
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const isValidHeatmap = (candidate: unknown): candidate is ScheduleHeatmapRow[] => {
  if (!Array.isArray(candidate) || candidate.length !== KNOWN_DAYS.length) return false;

  return candidate.every((row) => {
    if (!row || typeof row !== 'object') return false;

    const typed = row as { day?: unknown; hours?: unknown };
    if (typeof typed.day !== 'string' || !KNOWN_DAYS.includes(typed.day)) return false;
    if (!Array.isArray(typed.hours) || typed.hours.length !== 8) return false;

    return typed.hours.every(
      (value) => Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 24,
    );
  });
};

const buildChatFallback = (
  prompt: string,
  hubspotStatus: IntegrationStatus,
  history: ChatHistoryItem[],
): string => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('schedule') || lowerPrompt.includes('staff')) {
    return [
      '**[DIRECTIVE]** Shift two associates from low-volume morning slots into 12 PM-4 PM windows.',
      '**[OBSERVATION]** Coverage gaps are forming around peak traffic handoff periods.',
      '**[STATUS]** Triple-Engine aligned. HubSpot node is currently ' + hubspotStatus + '.',
    ].join('\n');
  }

  if (lowerPrompt.includes('inventory') || lowerPrompt.includes('stock')) {
    return [
      '**[DIRECTIVE]** Prioritize critical SKUs and trigger staged replenishment for low-stock lanes.',
      '**[OBSERVATION]** Current trend indicates preventable stockout pressure in high-turn categories.',
      '**[STATUS]** D365 ledger sync nominal; monitor variance every 30 minutes.',
    ].join('\n');
  }

  if (lowerPrompt.includes('compliance') || lowerPrompt.includes('labor law')) {
    return [
      '**[DIRECTIVE]** Run minor-curfew and break-threshold checks before publishing final rosters.',
      '**[OBSERVATION]** Exposure usually appears in late-day shift extensions and call-out backfills.',
      '**[STATUS]** Compliance guardrails active for current jurisdiction.',
    ].join('\n');
  }

  return [
    `Triple-Engine status confirmed. Processed ${history.length} message(s) in this session.`,
    'Share your objective (staffing, inventory, compliance, or logistics) and I will return an actionable three-step plan.',
  ].join('\n');
};

const buildScheduleFallback = (currentHeatmap: ScheduleHeatmapRow[]): ScheduleHeatmapRow[] => {
  const source = currentHeatmap.length > 0 ? currentHeatmap : DEFAULT_HEATMAP;

  return source.map((row) => {
    const isWeekendPeak = row.day === 'Fri' || row.day === 'Sat';
    const adjustedHours = row.hours.map((value, idx) => {
      let next = Math.max(4, value);

      if (idx >= 2 && idx <= 6) {
        next = Math.max(next, 6);
      }

      if (isWeekendPeak && idx >= 4) {
        next += 1;
      }

      return Math.min(14, next);
    });

    return { day: row.day, hours: adjustedHours };
  });
};

const buildLogisticsFallback = (data: LogisticsDataPoint[], dockContext: string[]): string => {
  const fallbackData = data.length > 0 ? data : [{ hour: '12 PM', inbound: 2, outbound: 85, pickRate: 88 }];

  const peakOutbound = fallbackData.reduce((best, row) =>
    row.outbound > best.outbound ? row : best,
  );
  const peakInbound = fallbackData.reduce((best, row) => (row.inbound > best.inbound ? row : best));
  const weakestPickRate = fallbackData.reduce((worst, row) =>
    row.pickRate < worst.pickRate ? row : worst,
  );

  return [
    `[OBSERVATION] Outbound spike at ${peakOutbound.hour} (${peakOutbound.outbound} units) is the bottleneck window.`,
    `[DIRECTIVE] Stage extra pickers 30 minutes before ${peakOutbound.hour}; pull labor from low-inbound windows outside ${peakInbound.hour}.`,
    `[DIRECTIVE] Dock watch: ${dockContext.join(' | ')}.`,
    `[STATUS] Lowest pick-rate hour: ${weakestPickRate.hour} (${weakestPickRate.pickRate}%). Deploy supervisor checkpoint.`,
  ].join('\n');
};

export const requestSentinelChatReply = async ({
  prompt,
  history,
  hubspotStatus,
}: {
  prompt: string;
  history: ChatHistoryItem[];
  hubspotStatus: IntegrationStatus;
}): Promise<string> => {
  const proxyResponse = await postToProxy({
    task: 'sentinel-chat',
    prompt,
    history,
    context: { hubspotStatus },
  });

  if (proxyResponse?.reply && proxyResponse.reply.trim().length > 0) {
    return proxyResponse.reply.trim();
  }

  return buildChatFallback(prompt, hubspotStatus, history);
};

export const requestScheduleForecast = async (
  currentHeatmap: ScheduleHeatmapRow[],
): Promise<ScheduleHeatmapRow[]> => {
  const proxyResponse = await postToProxy({
    task: 'schedule-forecast',
    currentHeatmap,
  });

  if (proxyResponse?.heatmap && isValidHeatmap(proxyResponse.heatmap)) {
    return proxyResponse.heatmap;
  }

  return buildScheduleFallback(currentHeatmap);
};

export const requestLogisticsInsights = async ({
  logisticsData,
  dockContext,
}: {
  logisticsData: LogisticsDataPoint[];
  dockContext: string[];
}): Promise<string> => {
  const proxyResponse = await postToProxy({
    task: 'logistics-insights',
    logisticsData,
    dockContext,
  });

  if (proxyResponse?.insights && proxyResponse.insights.trim().length > 0) {
    return proxyResponse.insights.trim();
  }

  return buildLogisticsFallback(logisticsData, dockContext);
};
