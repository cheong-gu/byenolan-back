import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Nolan, NolanSchema } from './nolan.schema';
import { NolanController } from './nolan.controller';
import { NolanService } from './nolan.service';
import { Survey, SurveySchema } from '../Result/survey.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Nolan.name, schema: NolanSchema }]),
    MongooseModule.forFeature([{ name: Survey.name, schema: SurveySchema }]),
  ],
  controllers: [NolanController],
  providers: [NolanService],
})
export class NolanModule {}
