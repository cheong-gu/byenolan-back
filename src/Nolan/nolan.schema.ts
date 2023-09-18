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
  @Prop([{ answer: String, answer_no: Number }]) // answers �Ӽ��� ���� ��Ű�� ����
  answers: Array<{ answer: string; answer_no: number }>;
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
  @IsNotEmpty() // answers �Ӽ��� ���� ��Ű�� ����
  answers: Array<{ answer: string; answer_no: number }>;
  @IsNotEmpty()
  today_question: string;
  @IsNotEmpty()
  question_id: number;
}
