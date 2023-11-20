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
  constructor(private readonly surveyResultService: SurveyResultService) {}

  @Get()
  async getSurveyResult(
    @Query('age') age: string,
    @Query('gender') gender: string,
    @Query('percent') percent: number,
    @Query('title') title: string,
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

  @Get('result/:percent')
  async getResult(@Param('percent') percent: number) {
    return this.surveyResultService.findResult(percent);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUsers(@Body() createSurveyDto: SurveyResultDto) {
    const errors = await validate(createSurveyDto);
    if (errors.length > 0) {
      throw new HttpException(
        '잘못된 요청 형식입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
