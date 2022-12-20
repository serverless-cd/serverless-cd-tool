export const OTS_DEFAULT_CONFIG = {
  OTS_TASK_TABLE_NAME: 'task',
  OTS_USER_TABLE_NAME: 'user',
  OTS_APP_TABLE_NAME: 'application',
  OTS_TOKEN_TABLE_NAME: 'token',
  OTS_SESSION_TABLE_NAME: 'session',
  OTS_TASK_INDEX_NAME: 'task_index',
  OTS_USER_INDEX_NAME: 'user_index',
  OTS_APP_INDEX_NAME: 'application_index',
  OTS_TOKEN_INDEX_NAME: 'token_index',
};

export const OTS_INSTANCE_NAME = 'serverless-cd';

export const OTHER_DEFAULT_CONFIG = {
  SESSION_EXPIRATION: '5184000000',
  // OSS_BUCKET: 'test',
  DOWNLOAD_CODE_DIR: '/tmp/code',
  CD_PIPLINE_YAML: 'serverless-pipeline.yaml',
  GITHUB_CLIENT_ID: '',
  GITHUB_CLIENT_SECRET: '',
  COOKIE_SECRET: Math.random().toString(16).substr(2),
};
