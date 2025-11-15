export enum Severity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Critical = 'Critical',
}

export interface Alert {
    id: string;
    timestamp: string;
    type: string;
    description: string;
    severity: Severity;
    sourceIp: string;
    destinationIp: string;
    protocol: string;
    recommendation: string;
}

export interface TrafficLog {
    id: string;
    timestamp: string;
    sourceIp: string;
    destinationIp: string;
    protocol: string;
    port: number;
    payload: string;
}

export interface Rule {
    id: string;
    description: string;
    enabled: boolean;
}

export interface CodeVulnerability {
    id: string;
    line: number;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
    recommendation: string;
}