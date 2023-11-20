import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyResult, SurveyResultSchema } from './surveyResult.schema';
import { SurveyResultController } from './surveyResult.controller';
import { SurveyResultService } from './surveyResult.service';
import { Result, ResultSchema } from './result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SurveyResult.name, schema: SurveyResultSchema },
    ]),
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
  ],
  controllers: [SurveyResultController],
  providers: [SurveyResultService],
})
export class SurveyResultModule {}
