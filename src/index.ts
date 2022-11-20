import { lodash as _, fse, inquirer } from "@serverless-devs/core";
import path from "path";
import logger from "./common/logger";
import { IInput, IProps } from "./common/entity";
import * as constants from "./constants";
import { getCred } from "./util";
import Domain from "./resource/domain";
import Ots from "./resource/tablestore";
import Oss from "./resource/oss";
import devService from "./service/dev";
import updateService from "./service/update";

export default class SevrerlessCdTool {
  /**
   * 云资源创建
   * @param inputs
   * @returns
   */
  public async generate(inputs: IInput) {
    logger.debug(`input: ${JSON.stringify(inputs.props)}`);
    const { props = {} as IProps } = inputs;

    const configPath = _.get(inputs, "path.configPath");
    const cwd = configPath ? path.dirname(configPath) : process.cwd();

    // TODO: 如果 .env 已经存在，优先使用配置文件
    const envFilePath = path.join(cwd, ".env");
    if (fse.existsSync(envFilePath)) {
      const answers: any = await inquirer.prompt([
        {
          type: "list",
          name: "overwrite",
          message: `${envFilePath} is exised, determine whether to overwrite the file. Exit if not overwritten`,
          choices: ["yes", "no"],
        },
      ]);
      if (answers.overwrite === "no") {
        return;
      }
    }

    const dbPrefix = _.get(props, "dbPrefix", "cd");

    const omitProps = _.omit(props, ["dbPrefix", "serviceName"]);
    const p = _.mapValues(
      _.defaults(omitProps, constants.OTS_DEFAULT_CONFIG),
      (value, key) => {
        if (_.has(constants.OTS_DEFAULT_CONFIG, key)) {
          return `${dbPrefix}_${value}`;
        }
        return value;
      }
    );
    logger.debug(`transform ots values: ${JSON.stringify(p)}`);

    const credentials = await getCred(inputs);
    const envConfig: IProps = {
      ...constants.OTHER_DEFAULT_CONFIG,
      ...p,
      ACCOUNTID: credentials.AccountID,
      ACCESS_KEY_ID: credentials.AccessKeyID,
      ACCESS_KEY_SECRET: credentials.AccessKeySecret,
    };

    logger.info("init bucket start");
    if (_.toLower(envConfig.OSS_BUCKET) === "auto") {
      const oss = new Oss(envConfig);
      await oss.putBucket();
      envConfig.OSS_BUCKET = oss.bucketName;
    }
    logger.info("init bucket success");

    logger.info("init domain start");
    if (_.toLower(envConfig.DOMAIN) === "auto") {
      const domain = new Domain({
        project: {
          ...inputs.project,
        },
        credentials,
        appName: "get-domain",
      });
      envConfig.DOMAIN = await domain.get({
        type: "fc",
        user: envConfig.ACCOUNTID,
        region: envConfig.REGION,
        service: _.get(props, "serviceName", "serverless-cd"),
        function: "auto",
      });
    } else if (_.includes(envConfig.DOMAIN, "://")) {
      envConfig.DOMAIN = envConfig.DOMAIN.split("://")[1]; // 不带协议
    }
    logger.info("init domain success");

    logger.info("init ots start");
    const ots = new Ots(envConfig);
    await ots.init();
    logger.info("init ots success");

    let envStr = "";
    _.forEach(envConfig, (value, key) => (envStr += `${key}=${value || ""}\n`));
    fse.outputFileSync(envFilePath, envStr);
  }

  /**
   * 本地Dev开发
   * @param inputs
   */
  public async dev(inputs: IInput) {
    logger.debug(`input: ${JSON.stringify(inputs.props)}`);
    const hasHelp = devService.hasCommandHelp(inputs);
    if (hasHelp) {
      return;
    }

    const configPath = _.get(inputs, "path.configPath");
    await devService.checkEnv(configPath);
    await devService.replaceTemplateWithEnv(configPath, inputs);
  }

  public async update(inputs: IInput) {
    logger.debug(`input: ${JSON.stringify(inputs.props)}`);
    const hasHelp = updateService.hasCommandHelp(inputs);
    if (hasHelp) {
      return;
    }
    await updateService.updateService(inputs);
  }
}

const OtsDemo = Ots;

export { OtsDemo };
