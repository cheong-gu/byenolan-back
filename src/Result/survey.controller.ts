import { SurveyService } from './survey.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SurveyDto } from './survey.schema';
import { validate } from 'class-validator';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  async getSurvey(
    @Query('age') age: string,
    @Query('gender') gender: string,
    @Query('question_id') question_id: string[],
    @Query('answer_no') answer_no: string,
    @Query('page') page: string,
  ): Promise<object> {
    const res = await this.surveyService.findAll({
      age,
      gender,
      question_id,
      answer_no,
      page,
    });
    return res;
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUsers(@Body() createSurveyDto: SurveyDto) {
    const errors = await validate(createSurveyDto);
    if (errors.length > 0) {
      throw new HttpException(
        '�߸��� ��û �����Դϴ�.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.surveyService.create(createSurveyDto);
  }

  @Get('/percent/:question_id')
  async getPercentage(@Param('question_id') question_id: number) {
    return this.surveyService.percentage(question_id);
  }

  @Get('/total/:question_id')
  async getTotal(@Param('question_id') question_id: string) {
    const questionIds = question_id.split(',').map(Number); // ���ڿ��� �迭�� �Ľ��ϰ� ���ڷ� ��ȯ
    return this.surveyService.total(questionIds);
  }
}
