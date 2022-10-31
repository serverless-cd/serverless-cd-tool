import { load } from '@serverless-devs/core';
import { ServerlessProfile } from '../common/entity';

export default class Domain {
  serverlessProfile: ServerlessProfile;
  constructor(serverlessProfile: ServerlessProfile) {
    this.serverlessProfile = serverlessProfile;
  }

  async get(props: any) {
    const inputs: any = Object.assign({}, {
      ...this.serverlessProfile,
      props,
    });
    // TODO: 是否需要先创建一个函数，预防域名被释放
    const domainComponentIns = await load('devsapp/domain');
    return await domainComponentIns.get(inputs);;
  }
}
