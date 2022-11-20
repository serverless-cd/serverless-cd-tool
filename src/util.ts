import * as dotenv from "dotenv";
import {
  lodash as _,
  getCredential,
  fse,
  commandParse,
  CatchableError,
} from "@serverless-devs/core";
import path from "path";
import { ICredentials, IInput } from "./common/entity";

export const getExampleValue = (cwd: string) => {
  const envExampleFilePath = path.join(cwd, ".env.example");
  const envExampleFileExists = fse.existsSync(envExampleFilePath);
  return envExampleFileExists
    ? dotenv.config({ path: envExampleFilePath }).parsed
    : {};
};

export const getCred = async (inputs: IInput): Promise<ICredentials> => {
  const props = _.get(inputs, "props", {});
  if (props.ACCOUNTID && props.ACCESS_KEY_ID && props.ACCESS_KEY_SECRET) {
    return {
      AccountID: props.ACCOUNTID,
      AccessKeyID: props.ACCESS_KEY_ID,
      AccessKeySecret: props.ACCESS_KEY_SECRET,
    };
  }
  const access = _.get(inputs, "project.access");
  const credentials = _.get(inputs, "credentials", await getCredential(access));
  return {
    AccountID: credentials.AccountID,
    AccessKeyID: credentials.AccessKeyID,
    AccessKeySecret: credentials.AccessKeySecret,
  };
};

export const hasHelpOptions = (inputs: IInput): boolean => {
  const parsedArgs: { [key: string]: any } = commandParse(inputs, {
    boolean: ["help"],
    alias: { help: "h" },
  });
  return parsedArgs?.data?.help;
};

const getCurrentPath = (configPath: any) => {
  return process.cwd();
};

export const getSrcPath = async (configPath: any): Promise<string> => {
  const currentPath = getCurrentPath(configPath);
  const isInRootPath = await fse.pathExists(
    path.join(currentPath, "publish.yaml")
  );
  const isInSrcPath = await fse.pathExists(
    path.join(currentPath, "generate.yaml")
  );
  let srcPath = "";
  // 在src目录下面才work
  if (isInRootPath) {
    srcPath = path.join(currentPath, "src");
  } else if (isInSrcPath) {
    srcPath = currentPath;
  } else {
    throw new CatchableError("请在serverless-cd 项目的根目录下面执行指令");
  }
  return srcPath;
};
