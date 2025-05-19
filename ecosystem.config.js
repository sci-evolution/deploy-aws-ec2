// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'deploy-aws-ec2-3001', // Distinct name for the first instance
      script: 'npm',
      args: 'start',
      // cwd: '.',
      exec_mode: 'fork', // Explicitly use fork mode
      instances: 1,      // In fork mode, instances is usually 1 (or omitted) for a single config entry
      watch: false,
      ignore_watch: ['node_modules'],
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001 // <-- Port for the first instance
      },
      output: '/var/log/pm2/deploy-aws-ec2-3001-out.log', // Separate logs for each instance
      error: '/var/log/pm2/deploy-aws-ec2-3001-err.log',   // Separate logs
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // kill_timeout: 10000, // Optional: Time to wait for graceful shutdown
    },
    {
      name: 'deploy-aws-ec2-3002', // Distinct name for the second instance
      script: 'npm',
      args: 'start',
      // cwd: '.',
      exec_mode: 'fork', // Explicitly use fork mode
      instances: 1,      // In fork mode, instances is usually 1 (or omitted)
      watch: false,
      ignore_watch: ['node_modules'],
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002 // <-- Port for the second instance
      },
      output: '/var/log/pm2/deploy-aws-ec2-3002-out.log', // Separate logs for each instance
      error: '/var/log/pm2/deploy-aws-ec2-3002-err.log',   // Separate logs
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // kill_timeout: 10000, // Optional: Time to wait for graceful shutdown
    }
    // Add more app entries here with different ports if you want more instances
  ],
};