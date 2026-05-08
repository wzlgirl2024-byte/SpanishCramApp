/**
 * 全局请求缓存，用于保存正在进行的AI请求
 * 避免用户切换标签时中断请求导致浪费API费用
 */

// 存储正在进行的请求 {key: {promise, timestamp, type}}
const ongoingRequests = new Map();

/**
 * 获取或创建一个请求
 * @param {string} key - 请求的唯一标识
 * @param {Function} requestFn - 返回Promise的请求函数
 * @param {string} type - 请求类型（用于调试）
 * @returns {Promise} 请求Promise
 */
export async function getCachedRequest(key, requestFn, type = 'unknown') {
    // 如果已经有正在进行的请求，直接返回
    if (ongoingRequests.has(key)) {
        const cached = ongoingRequests.get(key);
        console.log(`[RequestCache] 复用正在进行的${type}请求:`, key);
        return cached.promise;
    }

    // 创建新请求
    console.log(`[RequestCache] 创建新的${type}请求:`, key);
    const promise = requestFn()
        .then(result => {
            // 请求成功，从缓存中移除
            ongoingRequests.delete(key);
            console.log(`[RequestCache] ${type}请求完成:`, key);
            return result;
        })
        .catch(error => {
            // 请求失败，从缓存中移除
            ongoingRequests.delete(key);
            console.error(`[RequestCache] ${type}请求失败:`, key, error);
            throw error;
        });

    // 保存到缓存
    ongoingRequests.set(key, {
        promise,
        timestamp: Date.now(),
        type
    });

    return promise;
}

/**
 * 检查是否有正在进行的请求
 * @param {string} key - 请求的唯一标识
 * @returns {boolean}
 */
export function hasOngoingRequest(key) {
    return ongoingRequests.has(key);
}

/**
 * 取消所有正在进行的请求（仅从缓存中移除，不会真正取消HTTP请求）
 */
export function clearAllRequests() {
    const count = ongoingRequests.size;
    ongoingRequests.clear();
    console.log(`[RequestCache] 清除了${count}个缓存请求`);
}

/**
 * 获取当前所有正在进行的请求
 * @returns {Array} 请求列表
 */
export function getOngoingRequests() {
    return Array.from(ongoingRequests.entries()).map(([key, value]) => ({
        key,
        type: value.type,
        duration: Date.now() - value.timestamp
    }));
}
