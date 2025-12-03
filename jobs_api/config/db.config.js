// jobs-api/config/db.config.js

module.exports = {
  HOST: "localhost", 
  USER: "root", 
  PASSWORD: "", 
  DB: "jobs_web", 
  dialect: "mysql",
  pool: { 
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};