module.exports = {
  apps : [{
    name   : "deploy-aws-ec2",
    script : "npm",
    args   : "start",
    exec_mode  : "cluster",
    instances  : "max",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
