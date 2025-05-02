import { Global, Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('appConfig.mailHost'),
          secure: false,
          port: 2525,
          auth: {
            user: config.get<string>('appConfig.smtpUserName'),
            pass: config.get<string>('appConfig.smtpPassword'),
          },
        },
        defaults: {
          from: `"My Blog" <no-repy@nestjs-blog.com>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
          }),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
