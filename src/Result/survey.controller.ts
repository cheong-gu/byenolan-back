import { SurveyService } from './survey.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Survey, SurveyDto } from './survey.schema';
import { validate } from 'class-validator';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  async getSurvey(
    @Query('age') age: string,
    @Query('gender') gender: string,
    @Query('question_id') question_id: string[],
    @Query('page') page: string,
  ): Promise<object> {
    const res = await this.surveyService.findAll({
      age,
      gender,
      question_id,
      page,
    });
    return res;
  }
}
