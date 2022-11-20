# Serverless-cd tool
Serverless-cd的 CLI工具箱， 用来资源创建generate，更新update，开发dev等。

# 使用

## 资源创建
`s cli serverless-cd-tool generate`

## 本地开发
`s cli serverless-cd-tool dev`
主要做下面几个事情
1. 生成`.env`文件
2. 生成测试文件`s.dev.yaml`文件

## 更新
1. 更新所有的服务

`s cli serverless-cd-tool update`

2. 更新单个服务

`s cli serverless-cd-tool update --service worker`

3. 更新多个服务

`s cli serverless-cd-tool update --service worker,master`