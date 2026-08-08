import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
 
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }
 
  
    async sendToHrManager(to: string, subject: string, html: string) {
    try {
      const data = await this.resend.emails.send({
        from: 'PM SOFTWRE <noreply@update.faizbot.ai>', // must be a verified sender
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to}`);
      return data;
    } catch (error:any) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }


}
