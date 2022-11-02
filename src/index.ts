import { lodash as _, fse, inquirer } from "@serverless-devs/core";
import path from 'path';
import logger from './common/logger';
import { IInput, IProps } from './common/entity';
import * as constants from './constants';
import { getCred, getExampleValue } from "./util";
import Domain from './resource/domain';
import Ots from './resource/tablestore';
import Oss from "./resource/oss";


export default class ComponentDemo {
  /**
   * demo 实例
   * @param inputs
   * @returns
   */
  public async generate(inputs: IInput) {
    logger.debug(`input: ${JSON.stringify(inputs.props)}`);
    const { props = {} as IProps } = inputs;

    const configPath = _.get(inputs, 'path.configPath');
    const cwd = configPath ? path.dirname(configPath) : process.cwd();

    // TODO: 如果 .env 已经存在，优先使用配置文件
    const envFilePath = path.join(cwd, '.env');
    if (fse.existsSync(envFilePath)) {
      const answers: any = await inquirer.prompt([
        {
          type: 'list',
          name: 'overwrite',
          message: `${envFilePath} is exised, determine whether to overwrite the file. Exit if not overwritten`,
          choices: ['yes', 'no'],
        },
      ]);
      if (answers.overwrite === 'no') {
        return;
      }
    }

    const credentials = await getCred(inputs);
    const defaultValues = _.defaults(constants.OTS_DEFAULT_CONFIG, getExampleValue(cwd));
    const envConfig: IProps = {
      ...defaultValues,
      ...constants.OTHER_DEFAULT_CONFIG,
      ...props,
      ACCOUNTID: credentials.AccountID,
      ACCESS_KEY_ID: credentials.AccessKeyID,
      ACCESS_KEY_SECRET: credentials.AccessKeySecret,
    };

    
    logger.info('init bucket start');
    if (_.toLower(envConfig.OSS_BUCKET) === 'auto') {
      const oss = new Oss(envConfig);
      await oss.putBucket();
    }
    logger.info('init bucket success');

    logger.info('init domain start');
    if (_.toLower(envConfig.DOMAIN) === 'auto') {
      const domain = new Domain({
        project: {
          ...inputs.project,
        },
        credentials,
        appName: 'get-domain',
      });
      envConfig.DOMAIN = await domain.get({
        type: 'fc',
        user: envConfig.ACCOUNTID,
        region: envConfig.REGION,
        service: envConfig.serviceName || 'serverless-cd',
        function: 'gen-domain',
      });
    } else if (_.includes(envConfig.DOMAIN, '://')) {
      envConfig.DOMAIN = envConfig.DOMAIN.split('://')[1]; // 不带协议
    }
    logger.info('init domain success');

    logger.info('init ots start');
    const ots = new Ots(envConfig);
    await ots.init();
    logger.info('init ots success');

    let envStr = '';
    _.forEach(envConfig, (value, key) => envStr += `${key}=${value || ''}\n`);
    fse.outputFileSync(envFilePath, envStr)

    if (!envConfig.GITHUB_CLIENT_ID) {
      logger.log('Please populate.env with GITHUB_CLIENT_ID before deploy', 'red');
    }
    if (!envConfig.GITHUB_CLIENT_SECRET) {
      logger.log('Please populate.env with GITHUB_CLIENT_SECRET before deploy', 'red');
    }
  }
}
