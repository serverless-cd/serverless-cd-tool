// refer: https://github.com/aliyun/aliyun-tablestore-nodejs-sdk
import { Client } from 'tablestore';
import { lodash as _ } from '@serverless-devs/core';
import { IProps } from '../../common/entity';
import * as generateDbParams from './generate-db-params';
import logger from '../../common/logger';


export default class Ots {
  client: Client;
  dbConfig: any;

  constructor(envConfig: IProps) {
    this.client = new Client({
      accessKeyId: envConfig.ACCESS_KEY_ID,
      accessKeySecret: envConfig.ACCESS_KEY_SECRET,
      // securityToken: credentials.SecurityToken,
      endpoint: `https://${envConfig.OTS_INSTANCE_NAME}.${envConfig.REGION}.ots.aliyuncs.com`,
      instancename: envConfig.OTS_INSTANCE_NAME,
      maxRetries: 20, // 默认20次重试，可以省略此参数。
    });

    this.dbConfig = [
      {
        name: envConfig.OTS_USER_TABLE_NAME,
        indexName: envConfig.OTS_USER_INDEX_NAME,
        genTableParams: generateDbParams.user,
        genIndexParams: generateDbParams.userIndex,
      },
      {
        name: envConfig.OTS_APP_TABLE_NAME,
        indexName: envConfig.OTS_APP_INDEX_NAME,
        genTableParams: generateDbParams.application,
        genIndexParams: generateDbParams.applicationIndex,
      },
      {
        name: envConfig.OTS_TASK_TABLE_NAME,
        indexName: envConfig.OTS_TASK_INDEX_NAME,
        genTableParams: generateDbParams.task,
        genIndexParams: generateDbParams.taskIndex,
      },
      {
        name: envConfig.OTS_TOKEN_TABLE_NAME,
        indexName: envConfig.OTS_TOKEN_INDEX_NAME,
        genTableParams: generateDbParams.token,
        genIndexParams: generateDbParams.tokenIndex,
      },
      {
        name: envConfig.OTS_SESSION_TABLE_NAME,
        genTableParams: generateDbParams.session,
      },
    ];
  }

  async init() {
    for (const { name, indexName, genTableParams, genIndexParams } of this.dbConfig) {
      logger.debug(`handler ${name} start`);
      await this.handlerTable(name, genTableParams(name));

      if (indexName) {
        await this.handlerIndex(name, indexName, genIndexParams(name, indexName));
      }

      logger.debug(`handler ${name} end`);
    }
  }

  private async handlerIndex(tableName: string, indexName: string, params: any) {
    logger.debug(`need handler index: ${indexName}`);
    try {
      await this.client.describeSearchIndex({ tableName, indexName });
      logger.debug(`check index ${indexName} exist, skip create`);
      return;
    } catch (ex) {
      logger.debug(`check index ${indexName} error: ${ex.message}`);
      if (ex.code !== 404) {
        throw ex;
      }
    }
    logger.debug(`need create index ${indexName}, params: ${JSON.stringify(params, null, 2)}`);
    await this.client.createSearchIndex(params);
    logger.debug(`create index ${indexName} success`);
  }


  private async handlerTable(tableName: string, params: any): Promise<Boolean> {
    logger.debug(`check table ${tableName}`);
    try {
      await this.client.describeTable({ tableName });
      logger.debug(`check table ${tableName} exist, skip create`);
      return;
    } catch (ex) {
      logger.debug(`check table ${tableName} error: ${ex.message}`);
      if (ex.code !== 404) {
        throw ex;
      }
    }
    logger.debug(`need create table ${tableName}, params: ${JSON.stringify(params, null, 2)}`);
    await this.client.createTable(params);
    logger.debug(`create table ${tableName} success`);
  }
}
