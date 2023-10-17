import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Nolan>;

@Schema({ collection: 'nolan' })
export class Nolan {
  @Prop()
  category: string;
  @Prop()
  type: string;
  @Prop()
  question: string;
  @Prop([{ answer: String, answer_no: String }]) // answers 속성에 대한 스키마 정의
  answers: Array<{ answer: string; answer_no: string }>;
  @Prop()
  today_question: string;
  @Prop()
  question_id: number;
}

export const NolanSchema = SchemaFactory.createForClass(Nolan);

export class NolanDto {
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  question: string;
  @IsNotEmpty() // answers 속성에 대한 스키마 정의
  answers: Array<{ answer: string; answer_no: string }>;
  @IsNotEmpty()
  today_question: string;
  @IsNotEmpty()
  question_id: number;
}
