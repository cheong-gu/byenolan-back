import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Nolan, NolanSchema } from './nolan.schema';
import { NolanController } from './nolan.controller';
import { NolanService } from './nolan.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Nolan.name, schema: NolanSchema }]),
  ],
  controllers: [NolanController],
  providers: [NolanService],
})
export class NolanModule {}
