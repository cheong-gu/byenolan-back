import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from './result.schema';
import { SurveyResultController } from './surveyResult.controller';
import { SurveyResultService } from './surveyResult.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
  ],
  controllers: [SurveyResultController],
  providers: [SurveyResultService],
})
export class SurveyModule {}
