/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes - The size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with appropriate unit (KB, MB, GB, etc.)
 */
export function formatSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
