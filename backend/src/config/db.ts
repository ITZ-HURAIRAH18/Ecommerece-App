import mongoose from 'mongoose';
import https from 'https';
import dns from 'dns';
import { env } from './env';

/**
 * Resolve SRV records using DNS-over-HTTPS (Cloudflare).
 * This bypasses ISP DNS blocking completely.
 */
function resolveSrvViaDoH(srvName: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(srvName)}&type=SRV`;
    https.get(url, { headers: { 'Accept': 'application/dns-json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (!json.Answer || json.Answer.length === 0) {
            return reject(new Error(`No SRV records found for ${srvName}`));
          }
          // SRV data format: "priority weight port target"
          const hosts = json.Answer
            .filter((a: any) => a.type === 33) // SRV record type
            .map((a: any) => {
              const parts = a.data.split(' ');
              return { priority: +parts[0], weight: +parts[1], port: +parts[2], target: parts[3].replace(/\.$/, '') };
            });
          resolve(hosts);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Resolve a hostname to IP addresses using DNS-over-HTTPS.
 */
function resolveHostViaDoH(hostname: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`;
    https.get(url, { headers: { 'Accept': 'application/dns-json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const ips = (json.Answer || []).filter((a: any) => a.type === 1).map((a: any) => a.data);
          resolve(ips);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Build a direct mongodb:// connection string by resolving SRV records via DoH.
 */
async function buildDirectUri(srvUri: string): Promise<{ directUri: string; dbName: string | undefined }> {
  const parsed = new URL(srvUri);
  const srvHostname = parsed.hostname;
  const srvName = `_mongodb._tcp.${srvHostname}`;

  console.log(`   Resolving SRV: ${srvName} via DNS-over-HTTPS...`);
  const hosts = await resolveSrvViaDoH(srvName);
  console.log(`   Found ${hosts.length} MongoDB hosts`);

  // Resolve each host to IP addresses (bypasses local DNS)
  const resolvedHosts = [];
  for (const host of hosts) {
    try {
      const ips = await resolveHostViaDoH(host.target);
      if (ips.length > 0) {
        resolvedHosts.push(`${ips[0]}:${host.port}`);
        console.log(`   ${host.target} → ${ips[0]}:${host.port}`);
      } else {
        // fallback to hostname
        resolvedHosts.push(`${host.target}:${host.port}`);
      }
    } catch {
      resolvedHosts.push(`${host.target}:${host.port}`);
    }
  }

  // Extract database name from path or search params
  const dbName = parsed.pathname && parsed.pathname !== '/'
    ? decodeURIComponent(parsed.pathname.slice(1).split('/')[0])
    : parsed.searchParams.get('appName') || undefined;

  // Build direct mongodb:// URI
  const auth = parsed.username
    ? `${parsed.username}:${parsed.password}@`
    : '';

  const directUri = `mongodb://${auth}${resolvedHosts.join(',')}/${dbName || ''}?ssl=true&authSource=admin&retryWrites=true&w=majority`;

  return { directUri, dbName: dbName ?? undefined };
}

/**
 * Extract the database name from a MongoDB URI path (e.g. /Ecommerece → "Ecommerece").
 */
function getDbNameFromUri(uri: string): string | null {
  try {
    const parsed = new URL(uri);
    const pathDb = parsed.pathname && parsed.pathname !== '/'
      ? decodeURIComponent(parsed.pathname.slice(1).split('/')[0])
      : null;
    return pathDb || null;
  } catch {
    return null;
  }
}

export const connectDB = async (): Promise<void> => {
  const uri = env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set in your environment. ' +
      'Please add your MongoDB connection string.'
    );
  }

  // Extract DB name from URI path or use default
  const dbName = getDbNameFromUri(uri) || 'Ecommerece';

  const connectOptions = {
    dbName,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 30000,
  };

  // --- Attempt 1: Try direct connection with SRV URI ---
  try {
    console.log('⏳ Connecting to MongoDB (SRV)...');
    // Set DNS to Google/Cloudflare in case system DNS is partially broken
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

    await mongoose.connect(uri, connectOptions);
    console.log('✅ MongoDB connected successfully (SRV)');
    console.log(`   Database: ${mongoose.connection.db?.databaseName}`);
    return;
  } catch (srvError: any) {
    console.log(`⚠️  SRV connection failed: ${srvError.message}`);
    await mongoose.disconnect().catch(() => {});
  }

  // --- Attempt 2: Bypass DNS entirely using DNS-over-HTTPS ---
  if (uri.startsWith('mongodb+srv://')) {
    try {
      console.log('⏳ Bypassing DNS — resolving via DNS-over-HTTPS...');
      const { directUri } = await buildDirectUri(uri);

      await mongoose.connect(directUri, {
        ...connectOptions,
        tls: true,
        tlsAllowInvalidHostnames: true,
      });
      console.log('✅ MongoDB connected successfully (direct IP)');
      console.log(`   Database: ${mongoose.connection.db?.databaseName}`);
      return;
    } catch (directError: any) {
      console.error(`❌ Direct connection also failed: ${directError.message}`);
      await mongoose.disconnect().catch(() => {});
      throw directError;
    }
  }

  throw new Error('Unable to connect to MongoDB');
};
