import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../users/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'LeKhang',
      subject: 'Chào mừng bạn!',
      template: './welcome', // tương ứng với templates/welcome.ejs
      context: {
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
      },
    });
  }
}
