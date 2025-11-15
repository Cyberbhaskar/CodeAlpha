
import { TrafficLog } from '../types';

const randomIp = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

const protocols = ['TCP', 'UDP', 'ICMP'];
const commonPorts = [80, 443, 22, 21, 25, 53, 110, 1433, 3306, 5432];

const benignPayloads = [
    'GET /index.html HTTP/1.1',
    'DNS Standard query 0x1234 A www.google.com',
    'SSH-2.0-OpenSSH_8.2p1',
    'HELO example.com',
    'POST /api/data {"user":"test"}',
];

const suspiciousPayloads = [
    "GET /login.php?user=' OR 1=1--",
    "GET /../../etc/passwd",
    "Nmap Scan",
    "<script>alert('XSS')</script>",
    "admin:password login attempt",
];

let logCounter = 0;

export const generateMockTraffic = (blockedIPs: string[] = []): TrafficLog => {
    logCounter++;
    const isSuspicious = Math.random() < 0.15; // 15% chance of being suspicious
    
    let sourceIp = randomIp();
    // Ensure we don't generate traffic from a blocked IP
    while (blockedIPs.includes(sourceIp)) {
        sourceIp = randomIp();
    }
    
    const destinationIp = `10.0.0.${Math.floor(Math.random() * 255)}`;
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const port = commonPorts[Math.floor(Math.random() * commonPorts.length)];
    const payload = isSuspicious 
        ? suspiciousPayloads[Math.floor(Math.random() * suspiciousPayloads.length)]
        : benignPayloads[Math.floor(Math.random() * benignPayloads.length)];

    return {
        id: `log-${Date.now()}-${logCounter}`,
        timestamp: new Date().toISOString(),
        sourceIp,
        destinationIp,
        protocol,
        port,
        payload,
    };
};
