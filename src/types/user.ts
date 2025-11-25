export interface loginData {
    username: string;
    password: string;
}

export interface userInfo {
  uid: number;
  username: string;
  avatar_url: string; // 用户头像
  telephone: string; // 绑定的手机号
  wechat_id: string; // 绑定的微信号
  points: number;    // 积分数
  grade: string;     // 年级 (例如: "大学 · 二年级")
}