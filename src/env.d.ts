// src/env.d.ts
/// <reference types="vite/client" />

// 扩展 ImportMetaEnv 接口，声明你用到的 VITE_ 前缀环境变量
interface ImportMetaEnv {
  // 后端基础地址（对应你配置的 VITE_API_BASE_URL）
  readonly VITE_API_BASE_URL: string;
  // 新增其他环境变量时，同步添加到这里（保持类型一致）
}

// 扩展 ImportMeta 接口，指定 env 属性的类型为上面的 ImportMetaEnv
interface ImportMeta {
  readonly env: ImportMetaEnv;
}