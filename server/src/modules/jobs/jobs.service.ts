import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { schedule } from 'node-cron';



@Injectable()
export class JobsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) { }

  onModuleInit() {
    // this.scheduleJob();
  };

  // private scheduleJob() {
  //   schedule('0 12 * * *', async () => {
  //     console.log('🕒 Job exécuté');


  //   });
  // }
}