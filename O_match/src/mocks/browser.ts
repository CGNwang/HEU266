import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// 创建 worker 并导出
export const worker = setupWorker(...handlers);

// 启动 worker（在 main.tsx 中调用）
// worker.start() 会自动拦截请求并返回 mock 数据