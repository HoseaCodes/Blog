import fs from "fs";
import path from "path";
import CronJob from "node-cron";
import { exec } from "child_process";
import AWS from "aws-sdk";
import { stringToDate, empty, listFiles } from "../utils/helperFunctions.js";

// Auto backup function
// Only back up the database if there was a new deployment
export const dbAutoBackUp = async () => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const __dirname = path.resolve(path.dirname(""));
  const backupDirPath = path.join(__dirname, "database-backup");
  const backupName = process.env.BACKUP_NAME;
  const bucket = process.env.BACKUP_BUCKET_NAME;
  const dumpPath = path.resolve(__dirname, backupName);
  const s3 = new AWS.S3();

  const dbOptions = {
    user: process.env.DBUSER,
    pass: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DBNAME,
    uri: process.env.MONGODB_URL || "mongodb://localhost:27017/portflio",
    autoBackup: true,
    removeOldBackup: false,
    keepLastDaysBackup: 2,
    autoBackupPath: backupDirPath,
  };

  // check for auto backup is enabled or disabled
  if (dbOptions.autoBackup) {
    let date = new Date();
    let beforeDate, oldBackupDir, oldBackupPath;

    // Current date
    let currentDate = stringToDate(date);
    let newBackupDir =
      currentDate.getFullYear() +
      "-" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getDate();

    // New backup path for current backup process
    let newBackupPath = dbOptions.autoBackupPath + "-mongodump-" + newBackupDir;
    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup) {
      beforeDate = _.clone(currentDate);
      // Substract number of days to keep backup and remove old backup
      beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup);
      oldBackupDir =
        beforeDate.getFullYear() +
        "-" +
        (beforeDate.getMonth() + 1) +
        "-" +
        beforeDate.getDate();
      // old backup(after keeping # of days)
      oldBackupPath = dbOptions.autoBackupPath + "mongodump-" + oldBackupDir;
    }

    let cmd =
      "mongodump --uri=" +
      dbOptions.uri +
      ` --gzip --archive=${dumpPath} ` +
      " --out " +
      newBackupPath;

    try {
      await exec(cmd, (error, stdout, stderr) => {
        console.log({ error, stdout, stderr });
        if (empty(error)) {
          // check for remove old backup after keeping # of days given in configuration.
          if (dbOptions.removeOldBackup) {
            if (fs.existsSync(oldBackupPath)) {
              exec("rm -rf " + oldBackupPath, (err) => {});
            }
          }
        }
      });

      const backupFiles = [
        "articles.bson",
        "articles.metadata.json",
        "categories.bson",
        "categories.metadata.json",
        "comments.bson",
        "comments.metadata.json",
        "payments.bson",
        "payments.metadata.json",
        "products.bson",
        "products.metadata.json",
        "sessions.bson",
        "sessions.metadata.json",
        "users.bson",
        "users.metadata.json",
      ];
      //   const readStream = fs.createReadStream(__dirname + "/dump/portflio/");
      //   const params = {
      //     Bucket: bucket,
      //     Key: backupName,
      //     Body: readStream,
      //   };
      // await s3.putObject(params).promise();

      backupFiles.forEach(async (file) => {
        console.log(file);
        const readStream = fs.createReadStream(
          __dirname + "/dump/portflio/" + file
        );
        const params = {
          Bucket: bucket,
          Key: `${backupName}-${file}`,
          Body: readStream,
        };
        await s3.putObject(params).promise();
      });


      console.log("Successful backup!");
      console.log("Backup path: ", __dirname + "/dump");
    } catch (error) {
      console.log(`Backup failed: ${error}`);
    }
  }
};

// AutoBackUp every week (at 00:00 on Sunday)
export const initBackUpDBJob = () => {
  const backUpJobFunction = CronJob.schedule(
    "0 0 *  * 0",
    async () => {
      dbAutoBackUp();
    },
    {
      scheduled: true,
      timezone: "America/Chicago",
    }
  );

  backUpJobFunction.start();
};
