import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type ResultDocument = HydratedDocument<Result>;

@Schema({ collection: 'result' })
export class Result {
  @Prop()
  percent: number;
  @Prop()
  title: string;
  @Prop()
  subtitle: string;
  @Prop()
  content: string;
  @Prop()
  type: string;
}

export const ResultSchema = SchemaFactory.createForClass(Result);

export class ResultDto {
  @IsNotEmpty()
  percent: number;
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  subtitle: string;
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  type: string;
}
