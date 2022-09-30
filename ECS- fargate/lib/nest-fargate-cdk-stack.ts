import {App, Fn, Tags} from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class NestFargateCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const vpc = new ec2.Vpc(this, "backend-nest-application-vpc", {
      maxAzs: 2,
      natGateways: 1
    })
    
    const ingestApplicationCluster = new ecs.Cluster(this, "backend-nest-ingest-cluster", {
      vpc,
      clusterName: "music-cluster"
    })

    const ingestApp = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'backend-nest-load-balanced-application', {
      cluster: ingestApplicationCluster,
      desiredCount: 1,
      cpu: 256,
      memoryLimitMiB: 512,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset('../nest-application'),
        containerPort: 3000,
      }
    })
    
    ingestApp.targetGroup.configureHealthCheck({
      port: 'traffic-port',
      path: '/api/health',
      interval: cdk.Duration.seconds(300),
      timeout: cdk.Duration.seconds(4),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 2,
      healthyHttpCodes: "200,301,302"
    })
    
    const springbootAutoScaling = ingestApp.service.autoScaleTaskCount({
      maxCapacity: 2,
      minCapacity: 1
    })
    
    springbootAutoScaling.scaleOnCpuUtilization('cpu-autoscaling', {
      targetUtilizationPercent: 75,
      policyName: "cpu-autoscaling-policy",
      scaleInCooldown: cdk.Duration.seconds(30),
      scaleOutCooldown: cdk.Duration.seconds(30)
    })
  }
}
