import * as dotenv from 'dotenv';
import { lodash as _, getCredential, fse } from "@serverless-devs/core";
import path from 'path';
import { ICredentials, IInput } from './common/entity';

export const getExampleValue = (cwd: string) => {
  const envExampleFilePath = path.join(cwd, '.env.example');
  const envExampleFileExists = fse.existsSync(envExampleFilePath);
  return envExampleFileExists ? dotenv.config({ path: envExampleFilePath }).parsed : {};
}

export const getCred = async (inputs: IInput): Promise<ICredentials> => {
  const props = _.get(inputs, 'props', {});
  if (props.ACCOUNTID && props.ACCESS_KEY_ID && props.ACCESS_KEY_SECRET) {
    return {
      AccountID: props.ACCOUNTID,
      AccessKeyID: props.ACCESS_KEY_ID,
      AccessKeySecret: props.ACCESS_KEY_SECRET,
    };
  }
  const access = _.get(inputs, 'project.access');
  const credentials = _.get(inputs, 'credentials', await getCredential(access));
  return {
    AccountID: credentials.AccountID,
    AccessKeyID: credentials.AccessKeyID,
    AccessKeySecret: credentials.AccessKeySecret,
  };
}
