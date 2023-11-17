import { SurveyResultService } from './surveyResult.service';
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
import { SurveyResult, SurveyResultDto } from './surveyResult.schema';
import { validate } from 'class-validator';

@Controller('surveyResult')
export class SurveyResultController {
  constructor(private readonly surveyResultService: SurveyResult) {}

  @Get()
  async getSurveyResult(
    @Query('age') age: string,
    @Query('gender') gender: string,
    @Query('percent') question_id: number,
    @Query('title') answer_no: string,
    @Query('page') page: string,
  ): Promise<object> {
    const res = await this.surveyResultService.findAll({
      age,
      gender,
      percent,
      title,
      page,
    });
    return res;
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUsers(@Body() createSurveyDto: SurveyResultDto) {
    const errors = await validate(createSurveyDto);
    if (errors.length > 0) {
      throw new HttpException(
        '�߸��� ��û �����Դϴ�.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}