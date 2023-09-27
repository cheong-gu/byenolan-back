import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type ResultDocument = HydratedDocument<Survey>;

@Schema({ collection: 'survey' })
export class Survey {
  @Prop()
  age: string;
  @Prop()
  gender: string;
  @Prop()
  question_id: number;
  @Prop()
  answer_no: number;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);

export class SurveyDto {
  @IsNotEmpty()
  age: string;
  @IsNotEmpty()
  gender: string;
  @IsNotEmpty()
  question_id: number;
  @IsNotEmpty()
  answer_no: number;
}
