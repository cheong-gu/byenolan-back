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
  answer_no: string;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);

export class SurveyDto {
  age: string;
  gender: string;
  @IsNotEmpty()
  question_id: string;
  @IsNotEmpty()
  answer_no: string;
}
