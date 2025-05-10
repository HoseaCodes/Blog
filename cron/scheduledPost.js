import CronJob from "node-cron";
import Articles from "../models/article.js";
import moment from "moment";

export const initScheduledPostJob = () => {
  const scheduledJobFunction = CronJob.schedule(
    "0 12 * * *",
    async () => {
      const articles = await Articles.find({
        scheduled: true,
      });
      function isSameDay(targetDay) {
        const currentDay = moment().format("YYYY-MM-DD");
        return currentDay === targetDay;
      }

      articles.forEach(async (article) => {
        if (isSameDay(article.scheduledDateTime) && article.scheduled) {
          await Articles.findByIdAndUpdate(article._id, {
            scheduled: false,
            published: true,
          });
        }
      });
    },
    {
      scheduled: true,
      timezone: "America/Chicago",
    }
  );

  scheduledJobFunction.start();
};