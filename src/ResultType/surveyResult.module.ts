import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SurveyResult, SurveyResultSchema } from './surveyResult.schema';
import { SurveyResultController } from './surveyResult.controller';
import { SurveyResultService } from './surveyResult.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SurveyResult.name, schema: SurveyResultSchema },
    ]),
  ],
  controllers: [SurveyResultController],
  providers: [SurveyResultService],
})
export class SurveyModule {}
