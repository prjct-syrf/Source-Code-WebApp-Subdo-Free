
import { CloudflareConfig, Subdomain } from "../types";

const BASE_URL = "https://api.cloudflare.com/client/v4";

const getHeaders = (config: CloudflareConfig) => {
  return {
    "X-Auth-Email": config.email,
    "X-Auth-Key": config.apiKey,
    "Content-Type": "application/json",
  };
};

export const fetchDnsRecords = async (config: CloudflareConfig): Promise<Subdomain[]> => {
  const response = await fetch(`${BASE_URL}/zones/${config.zoneId}/dns_records?type=A,CNAME`, {
    method: "GET",
    headers: getHeaders(config),
  });

  const data = await response.json();
  if (!data.success) throw new Error(data.errors[0]?.message || "Failed to fetch records");

  return data.result.map((record: any) => ({
    id: record.id,
    name: record.name.split('.')[0],
    domain: record.zone_name,
    target: record.content,
    type: record.type,
    proxied: record.proxied,
    createdAt: record.created_on,
    status: 'active'
  }));
};

export const createDnsRecord = async (
  config: CloudflareConfig, 
  record: Omit<Subdomain, 'id' | 'createdAt' | 'status'>
): Promise<Subdomain> => {
  const response = await fetch(`${BASE_URL}/zones/${config.zoneId}/dns_records`, {
    method: "POST",
    headers: getHeaders(config),
    body: JSON.stringify({
      type: record.type,
      name: record.name,
      content: record.target,
      ttl: 1, // Automatic
      proxied: record.proxied,
    }),
  });

  const data = await response.json();
  if (!data.success) throw new Error(data.errors[0]?.message || "Failed to create record");

  const result = data.result;
  return {
    id: result.id,
    name: result.name.split('.')[0],
    domain: result.zone_name,
    target: result.content,
    type: result.type,
    proxied: result.proxied,
    createdAt: result.created_on,
    status: 'active'
  };
};

export const deleteDnsRecord = async (config: CloudflareConfig, recordId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/zones/${config.zoneId}/dns_records/${recordId}`, {
    method: "DELETE",
    headers: getHeaders(config),
  });

  const data = await response.json();
  if (!data.success) throw new Error(data.errors[0]?.message || "Failed to delete record");
};
