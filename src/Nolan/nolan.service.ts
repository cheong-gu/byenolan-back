import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nolan, NolanDto } from './nolan.schema';
import { Model } from 'mongoose';

@Injectable()
export class NolanService {
  constructor(@InjectModel(Nolan.name) private nolanModel: Model<Nolan>) {}

  async create(createNolanDto: NolanDto): Promise<Nolan> {
    const createCat = new this.nolanModel(createNolanDto);

    return createCat.save();
  }

  async findAll({
    category,
    type,
    question,
    today_question,
    question_id,
    page,
  }): Promise<object> {
    const findQuery = {};
    if (category != undefined) findQuery['category'] = category;
    if (type != undefined) findQuery['type'] = type;
    if (question != undefined) findQuery['question'] = question;
    if (today_question != undefined)
      findQuery['today_question'] = today_question;
    if (question_id != undefined) findQuery['question_id'] = question_id;
    if (page == undefined) page = 1;

    const datas = await this.nolanModel.find(findQuery).exec();
    datas.reverse();

    const results = datas;

    return {
      data: results,
      totalLength: datas.length,
    };
  }
}
