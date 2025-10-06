module.exports = {
  apps: [
    {
      name: 'nailnav',
      script: 'npx',
      args: 'next dev -H 0.0.0.0 -p 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false, // Disable PM2 file monitoring (Next.js handles hot reload)
      instances: 1, // Development mode uses only one instance
      exec_mode: 'fork',
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
}