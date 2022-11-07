import TableStore from 'tablestore';

const CREATED_OTS_DEFAULT_CONFIG = {
  tableOptions: {
    timeToLive: -1, //数据的过期时间，单位为秒，-1代表永不过期。如果设置过期时间为一年，即为365*24*3600。
    maxVersions: 1  //保存的最大版本数，设置为1代表每列上最多保存一个版本（保存最新的版本）。
  },
  reservedThroughput: {
    capacityUnit: {
      read: 0,
      write: 0
    },
  },
};
const FIELD_KEYWORD = {
  fieldType: TableStore.FieldType.KEYWORD,
  index: true,
  enableSortAndAgg: true,
  store: true,
}

const TIMER_FIELD = [
  {
    fieldName: 'updated_time',
    fieldType: TableStore.FieldType.LONG,
    index: true,
    enableSortAndAgg: true,
    store: true,
  },
  {
    fieldName: 'created_time',
    fieldType: TableStore.FieldType.LONG,
    index: true,
    enableSortAndAgg: true,
    store: true,
  }
];

/*
Table user {
  id string [pk]
  avatar string
  username string // 名称
  password string // 登录密码(加密)
  secrets string  // 个人密钥
  third_part string // 三方绑定(github等)登录的信息
  github_unionid string  // github授权的唯一标识ID
  created_time timestamp
  updated_time timestamp
}
*/
export const user = (tableName: string) => ({
  tableMeta: {
    tableName,
    primaryKey: [
      { name: 'id',  type: 'STRING' },
    ],
  },
  ...CREATED_OTS_DEFAULT_CONFIG,
});

export const userIndex = (tableName: string, indexName: string) => ({
  tableName,
  indexName,
  schema: {
    fieldSchemas: [
      {
        fieldName: 'id',
        fieldType: TableStore.FieldType.KEYWORD, // 设置字段名和字段类型。
        index: true, // 设置开启索引。
        enableSortAndAgg: true, // 设置开启排序与统计聚合功能。
        store: true, // 开启后，可以直接从多元索引中读取该字段的值，而不必反查数据表，可用于查询性能优化。
      },
      {
        fieldName: 'github_unionid',
        fieldType: TableStore.FieldType.KEYWORD,
        index: true,
        enableSortAndAgg: true,
        store: true,
      },
      {
        fieldName: 'third_part',
        fieldType: TableStore.FieldType.KEYWORD,
        index: true,
        enableSortAndAgg: true,
        store: true,
      },
      {
        fieldName: 'secrets',
        fieldType: TableStore.FieldType.KEYWORD,
        index: true,
        enableSortAndAgg: true,
        store: true,
      },
      {
        fieldName: 'password',
        fieldType: TableStore.FieldType.KEYWORD,
        index: true,
        enableSortAndAgg: true,
        store: true,
      },
      {
        fieldName: 'username',
        fieldType: TableStore.FieldType.KEYWORD,
        index: true,
        enableSortAndAgg: true,
        store: true,
      },
      {
        fieldName: 'avatar',
        fieldType: TableStore.FieldType.KEYWORD,
        index: true,
        enableSortAndAgg: true,
        store: true,
      },
      {
        fieldName: 'updated_time',
        fieldType: TableStore.FieldType.LONG,
        index: true,
        enableSortAndAgg: true,
        store: true,
      },
      {
        fieldName: 'created_time',
        fieldType: TableStore.FieldType.LONG,
        index: true,
        enableSortAndAgg: true,
        store: true,
      },
    ]
  }
});

/*
Table application {
  id string [pk, increment]
  user_id string  [ref: > user.id]
  owner string // github仓库登录的owner
  provider string // git代码托管厂商：github,gitee,gitlab,codeup
  provider_repo_id string // git代码repo唯一ID
  repo_name string // git代码repo 名称
  repo_url string // git代码repo url链接
  secrets string // 应用密钥secrets
  latest_task string // 最近生效的task信息
  trigger_spec string // trigger相关信息 
  created_time timestamp
  updated_time timestamp
}
*/
export const application = (tableName: string) => ({
  tableMeta: {
    tableName,
    primaryKey: [
      { name: 'id',  type: 'STRING' },
    ],
  },
  ...CREATED_OTS_DEFAULT_CONFIG,
});

export const applicationIndex = (tableName: string, indexName: string) => {
  const fieldSchemas = [...TIMER_FIELD];
  const stringKeys = ['id', 'user_id', 'owner', 'provider', 'provider_repo_id', 'repo_name', 'repo_url', 'secrets', 'latest_task', 'trigger_spec'];
  stringKeys.forEach(fieldName => fieldSchemas.push({
    ...FIELD_KEYWORD,
    fieldName,
  }));

  return {
    tableName,
    indexName,
    schema: { fieldSchemas },
  }
}


/*
Table task {
  id string [pk, increment]
  user_id string  [ref: > user.id]
  app_id string [ref: > application.id]
  status string // 任务执行状态
  steps string // 执行steps的详细信息
  trigger_payload string // webhook触发相关的信息
  created_time timestamp
  updated_time timestamp
}
*/
export const task = (tableName: string) => ({
  tableMeta: {
    tableName,
    primaryKey: [
      { name: 'id',  type: 'STRING' },
    ],
  },
  ...CREATED_OTS_DEFAULT_CONFIG,
});

export const taskIndex = (tableName: string, indexName: string) => {
  const fieldSchemas = [...TIMER_FIELD];
  const stringKeys = ['id', 'user_id', 'app_id', 'status', 'steps', 'trigger_payload'];
  stringKeys.forEach(fieldName => fieldSchemas.push({
    ...FIELD_KEYWORD,
    fieldName,
  }))

  return {
    tableName,
    indexName,
    schema: { fieldSchemas },
  }
}

/*
Table token {
  id string [pk, increment]
  team_id string  [ref: > team.id]
	cd_token string
  descripion string
  active_time string
  expire_time string
  created_time timestamp
  updated_time timestamp
}
*/
export const token = (tableName: string) => ({
  tableMeta: {
    tableName,
    primaryKey: [
      { name: 'id',  type: 'STRING' },
    ],
  },
  ...CREATED_OTS_DEFAULT_CONFIG,
});

export const tokenIndex = (tableName: string, indexName: string) => {
  const fieldSchemas = [...TIMER_FIELD];
  const stringKeys = ['id', 'user_id', 'team_id', 'cd_token', 'descripion', 'active_time', 'expire_time'];
  stringKeys.forEach(fieldName => fieldSchemas.push({
    ...FIELD_KEYWORD,
    fieldName,
  }))

  return {
    tableName,
    indexName,
    schema: { fieldSchemas },
  }
}

/*
Table session {
  id string [pk, increment]
  session_data string
  expire_time string
  created_time timestamp
  updated_time timestamp
}
*/
export const session = (tableName: string) => ({
  tableMeta: {
    tableName,
    primaryKey: [
      { name: 'id',  type: 'STRING' },
    ],
  },
  ...CREATED_OTS_DEFAULT_CONFIG,
});