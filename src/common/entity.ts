export interface ICredentials {
  AccountID: string;
  AccessKeyID: string;
  AccessKeySecret: string;
  SecurityToken?: string;
}

export interface ServerlessProfile {
  project: {
    component?: string;
    access: string;
    projectName: string;
  };
  credentials?: ICredentials;
  appName: string;
}

export interface IInput {
  props: IProps; // 用户自定义输入
  credentials: ICredentials; // 用户秘钥
  appName: string; // 
  project: {
    component: string; // 组件名（支持本地绝对路径）
    access: string; // 访问秘钥名
    projectName: string; // 项目名
  };
  command: string; // 执行指令
  args: string; // 命令行 扩展参数
  argsObj: any;
  path: {
    configPath: string // 配置路径
  }
}

export interface IProps {
  serviceName: string;
  REGION: string;
  OSS_BUCKET: string;
  OTS_INSTANCE_NAME: string;
  DOMAIN: string;
  DOWNLOAD_CODE_DIR?: string;
  CD_PIPLINE_YAML?: string;
  SESSION_EXPIRATION?: string;
  ACCOUNTID?: string;
  ACCESS_KEY_ID?: string;
  ACCESS_KEY_SECRET?: string;
  OTS_TASK_TABLE_NAME?: string;
  OTS_TASK_INDEX_NAME?: string;
  OTS_USER_TABLE_NAME?: string;
  OTS_USER_INDEX_NAME?: string;
  OTS_APP_TABLE_NAME?: string;
  OTS_APP_INDEX_NAME?: string;
  OTS_TOKEN_TABLE_NAME?: string;
  OTS_TOKEN_INDEX_NAME?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  COOKIE_SECRET?: string;
}
