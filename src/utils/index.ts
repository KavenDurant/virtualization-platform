/**
 * 通用工具函数
 */

/**
 * 格式化日期时间
 * @param date 日期对象或时间戳
 * @param format 格式化模式，默认为 'YYYY-MM-DD HH:mm:ss'
 */
export const formatDateTime = (
  date: Date | number | string,
  format = 'YYYY-MM-DD HH:mm:ss'
): string => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds);
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param decimals 小数位数，默认为2
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * 生成UUID
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 安全地获取本地存储数据
 * @param key 存储键名
 * @param defaultValue 默认值
 */
export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) {
      return defaultValue;
    }
    return JSON.parse(value) as T;
  } catch (e) {
    console.error('获取本地存储数据失败:', e);
    return defaultValue;
  }
};

/**
 * 安全地设置本地存储数据
 * @param key 存储键名
 * @param value 存储的值
 */
export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('设置本地存储数据失败:', e);
  }
};
