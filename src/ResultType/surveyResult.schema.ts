import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type ResultDocument = HydratedDocument<SurveyResult>;

@Schema({ collection: 'surveyResult' })
export class SurveyResult {
  @Prop()
  age: string;
  @Prop()
  gender: string;
  @Prop()
  percent: number;
  @Prop()
  title: string;
}

export const SurveyResultSchema = SchemaFactory.createForClass(SurveyResult);

export class SurveyResultDto {
  @IsNotEmpty()
  age: string;
  @IsNotEmpty()
  gender: string;
  @IsNotEmpty()
  percent: number;
  @IsNotEmpty()
  title: string;
}
