#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NestFargateCdkStack } from '../lib/nest-fargate-cdk-stack';

const app = new cdk.App();
new NestFargateCdkStack(app, 'BackendApp');
