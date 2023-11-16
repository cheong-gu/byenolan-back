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
