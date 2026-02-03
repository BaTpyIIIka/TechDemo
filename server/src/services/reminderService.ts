import cron from 'node-cron';
import { ReminderModel } from '../models/Reminder';
import { emailService } from './emailService';

export const reminderService = {
  startCronJob() {
    cron.schedule('*/5 * * * *', async () => {
      try {
        console.log('Checking for pending reminders...');
        const reminders = await ReminderModel.findPendingReminders();

        for (const reminder of reminders) {
          const sent = await emailService.sendReminderEmail(
            reminder.user_email,
            reminder.opportunity_name,
            reminder.message
          );

          if (sent) {
            await ReminderModel.markAsSent(reminder.id);
            console.log(`Reminder ${reminder.id} sent successfully`);
          }
        }
      } catch (error) {
        console.error('Reminder cron job error:', error);
      }
    });

    console.log('Reminder cron job started (runs every 5 minutes)');
  },
};
