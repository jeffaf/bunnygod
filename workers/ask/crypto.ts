/**
 * Cryptographic utilities for Bunny God Worker
 *
 * Provides SHA-256 hashing for privacy-preserving feedback storage
 */

/**
 * Generate SHA-256 hash of a string
 *
 * @param message - The string to hash
 * @returns Hex-encoded hash string
 */
export async function sha256Hash(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify that a hash matches the expected format
 *
 * @param hash - The hash string to validate
 * @returns True if valid SHA-256 hex string
 */
export function isValidHash(hash: string): boolean {
  return /^[a-f0-9]{64}$/i.test(hash);
}

/**
 * Generate a session fingerprint for rate limiting
 *
 * @param request - The incoming request
 * @returns Hashed fingerprint string
 */
export async function generateSessionFingerprint(request: Request): Promise<string> {
  const cf = (request as any).cf || {};
  const fingerprint = [
    request.headers.get('cf-connecting-ip') || '',
    request.headers.get('user-agent') || '',
    cf.colo || '', // Cloudflare data center
  ].join('|');

  return await sha256Hash(fingerprint);
}
