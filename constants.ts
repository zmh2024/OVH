/**
 * 应用全局常量配置
 * 确保前后端一致性
 */

// ==================== 任务队列配置 ====================

/**
 * 任务重试间隔（秒）
 * 前后端必须保持一致
 */
export const TASK_RETRY_INTERVAL = 60;

/**
 * 任务重试间隔的最小值（秒）
 * 防止用户设置过小的值导致API过载
 */
export const MIN_RETRY_INTERVAL = 30;

/**
 * 任务重试间隔的最大值（秒）
 * 防止用户设置过大的值
 */
export const MAX_RETRY_INTERVAL = 3600; // 1小时

/**
 * 最大重试次数
 * -1 表示无限重试
 */
export const MAX_RETRIES = -1;

// ==================== 轮询配置 ====================

/**
 * 队列状态轮询间隔（毫秒）
 * 前端查询任务状态的频率
 */
export const QUEUE_POLLING_INTERVAL = 10000; // 10秒

/**
 * 统计数据刷新间隔（毫秒）
 */
export const STATS_REFRESH_INTERVAL = 30000; // 30秒

/**
 * 日志自动刷新间隔（毫秒）
 */
export const LOGS_REFRESH_INTERVAL = 5000; // 5秒

// ==================== 缓存配置 ====================

/**
 * 服务器列表缓存时长（毫秒）
 * 前后端必须保持一致
 */
export const CACHE_EXPIRY = 2 * 60 * 60 * 1000; // 2小时

/**
 * 缓存键名
 */
export const CACHE_KEY = 'ovh-servers-cache';

// ==================== API配置 ====================

/**
 * 后端API地址
 */
export const API_URL = 'http://localhost:5000/api';

/**
 * API通信密钥
 * 用于验证前端请求，防止后端被直接调用
 * 生产环境请更换为复杂的随机字符串
 */
export const API_SECRET_KEY = 'ovh-phantom-sniper-2024-secret-key';

/**
 * 前端访问密码
 * 用于保护前端页面访问
 * 默认密码：admin123
 * 生产环境请修改此密码！
 */
export const FRONTEND_PASSWORD = 'admin123';

/**
 * 是否启用前端密码保护
 * 开发环境可以设置为 false，生产环境建议设置为 true
 */
export const ENABLE_FRONTEND_PASSWORD = true;

/**
 * API请求重试次数
 */
export const API_RETRY_COUNT = 1;

/**
 * API请求超时时间（毫秒）
 * 服务器列表获取可能需要较长时间（OVH API调用）
 */
export const API_TIMEOUT = 120000; // 120秒（2分钟）

// ==================== 辅助函数 ====================

/**
 * 验证重试间隔是否在合理范围内
 */
export function validateRetryInterval(interval: number): boolean {
  return interval >= MIN_RETRY_INTERVAL && interval <= MAX_RETRY_INTERVAL;
}

/**
 * 格式化时间间隔显示
 */
export function formatInterval(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 
      ? `${minutes}分${remainingSeconds}秒` 
      : `${minutes}分钟`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 
      ? `${hours}小时${minutes}分钟` 
      : `${hours}小时`;
  }
}

/**
 * 格式化重试计数显示
 */
export function formatRetryCount(count: number, maxRetries: number): string {
  if (maxRetries === -1) {
    return `第 ${count} 次尝试`;
  } else {
    return `第 ${count}/${maxRetries} 次尝试`;
  }
}
