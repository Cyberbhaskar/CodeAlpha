import { GoogleGenAI, Type } from "@google/genai";
import { Alert, Rule, TrafficLog, Severity, CodeVulnerability } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeLogs = async (logs: TrafficLog[], rules: Rule[]): Promise<Alert[]> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY is not set.");
        return [];
    }
    
    const rulesDescription = rules.map(r => `- ${r.description}`).join('\n');
    const logsString = logs.map(l => l.payload).join('\n'); // Pass raw payload
    
    const prompt = `
        As a senior cybersecurity analyst for a Network Intrusion Detection System (NIDS), analyze the following raw network traffic logs. 
        Your task is to identify any suspicious or malicious activities based on the provided detection rules.
        For each identified threat, generate a structured alert. If no threats are found, return an empty array.

        **Detection Rules:**
        ${rulesDescription}

        **Network Logs to Analyze:**
        ${logsString}

        Provide your response as a JSON array of alert objects.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: {
                                type: Type.STRING,
                                description: "The type of attack or suspicious activity (e.g., 'SQL Injection Attempt', 'Port Scan', 'Brute Force')."
                            },
                            description: {
                                type: Type.STRING,
                                description: "A brief, clear description of the detected threat and why it's considered suspicious."
                            },
                            severity: {
                                type: Type.STRING,
                                description: "The severity level of the alert. Must be one of: 'Low', 'Medium', 'High', 'Critical'.",
                                enum: Object.values(Severity)
                            },
                            sourceIp: {
                                type: Type.STRING,
                                description: "The source IP address involved in the activity. Extract it from the log line."
                            },
                            destinationIp: {
                                type: Type.STRING,
                                description: "The destination IP address. Extract it from the log line."
                            },
                            protocol: {
                                type: Type.STRING,
                                description: "The network protocol used (e.g., TCP, UDP, ICMP). Extract it from the log line."
                            },
                            recommendation: {
                                type: Type.STRING,
                                description: "A recommended action to take, such as 'Block source IP' or 'Investigate further'."
                            }
                        },
                         required: ["type", "description", "severity", "sourceIp", "destinationIp", "protocol", "recommendation"]
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        if (!jsonText) return [];
        
        const parsedAlerts = JSON.parse(jsonText);
        
        // Add unique ID and timestamp to each alert
        return parsedAlerts.map((alert: Omit<Alert, 'id' | 'timestamp'>) => ({
            ...alert,
            id: `alert-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
        }));

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return [];
    }
};

export const analyzeCode = async (code: string, language: string): Promise<CodeVulnerability[]> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY is not set.");
        return [];
    }
    
    const prompt = `
        Act as an expert security code reviewer. Analyze the following ${language} code snippet for security vulnerabilities.
        Identify issues such as injection flaws, cross-site scripting (XSS), insecure direct object references, security misconfigurations, sensitive data exposure, etc.
        For each vulnerability found, provide a concise description, the line number, a severity rating, and a clear recommendation for fixing it.
        If no vulnerabilities are found, return an empty array.

        **Code to Analyze:**
        \`\`\`${language}
        ${code}
        \`\`\`

        Provide your response as a JSON array of vulnerability objects.
    `;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            line: {
                                type: Type.INTEGER,
                                description: "The line number where the vulnerability occurs."
                            },
                            severity: {
                                type: Type.STRING,
                                description: "The severity level of the vulnerability. Must be one of: 'Low', 'Medium', 'High', 'Critical'.",
                                enum: ['Low', 'Medium', 'High', 'Critical']
                            },
                            description: {
                                type: Type.STRING,
                                description: "A brief, clear description of the security vulnerability."
                            },
                            recommendation: {
                                type: Type.STRING,
                                description: "A specific recommendation on how to fix the vulnerability."
                            }
                        },
                        required: ["line", "severity", "description", "recommendation"]
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) return [];

        const parsedVulns = JSON.parse(jsonText);
        
        return parsedVulns.map((vuln: Omit<CodeVulnerability, 'id'>) => ({
            ...vuln,
            id: `vuln-${Date.now()}-${Math.random()}`,
        }));

    } catch (error) {
        console.error("Error calling Gemini API for code analysis:", error);
        return [];
    }
};