import { NolanService } from './nolan.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Nolan, NolanDto } from './nolan.schema';
import { validate } from 'class-validator';

@Controller('nolan')
export class NolanController {
  constructor(private readonly nolanService: NolanService) {}

  @Get()
  async getNolan(
    @Query('category') category: string,
    @Query('type') type: string,
    @Query('question') question: string,
    @Query('today_question') today_question: string,
    @Query('question_id') question_id: string,
    @Query('page') page: string,
  ): Promise<object> {
    const res = await this.nolanService.findAll({
      category,
      type,
      question,
      today_question,
      question_id,
      page,
    });
    return res;
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUsers(@Body() createNolanDto: NolanDto) {
    const errors = await validate(createNolanDto);
    if (errors.length > 0) {
      throw new HttpException(
        '잘못된 요청 형식입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.nolanService.create(createNolanDto);
  }

  @Get('/todayNolan')
  async getTodayNolan() {
    return this.nolanService.todayNolan();
  }
  @Post('/todayNolan')
  async updateTodayNolan(@Query('questionId') questionId: number) {
    return this.nolanService.updateNolan(questionId);
  }
}
