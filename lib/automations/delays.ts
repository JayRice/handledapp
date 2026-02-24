export const DELAY_OPTIONS = [
    { key: "instant", label: "Instant", seconds: 0 },
    { key: "30_seconds", label: "30 seconds", seconds: 30 },
    { key: "2_minutes", label: "2 minutes", seconds: 120 },
    { key: "5_minutes", label: "5 minutes", seconds: 300 },
    { key: "2_hours", label: "2 hours", seconds: 7200 },
    { key: "24_hours", label: "24 hours", seconds: 86400 },
] as const;

export type DelayKey = typeof DELAY_OPTIONS[number]["key"];

export function delayKeyToSeconds(key: DelayKey | string): number {
    const match = DELAY_OPTIONS.find((d) => d.key === key);

    if (!match) {
        return Number(key);
    }

    return match.seconds;
}

export function secondsToDelayKey(seconds: number) : DelayKey | string {
    const match = DELAY_OPTIONS.find((d) => d.seconds === seconds);

    if (!match) {
        return `${seconds} seconds`;
    }

    return match.label;
}