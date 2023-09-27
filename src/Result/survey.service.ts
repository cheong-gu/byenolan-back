import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Survey, SurveyDto } from './survey.schema';
import { Model } from 'mongoose';

@Injectable()
export class SurveyService {
  constructor(@InjectModel(Survey.name) private surveyModel: Model<Survey>) {}

  async create(createSurveyDto: SurveyDto): Promise<Survey> {
    const createCat = new this.surveyModel(createSurveyDto);

    return createCat.save();
  }

  async findAll({
    age,
    gender,
    question_id,
    answer_no,
    page,
  }): Promise<object> {
    const findQuery = {};
    if (age != undefined) findQuery['age'] = age;
    if (gender != undefined) findQuery['gender'] = gender;
    if (answer_no != undefined) findQuery['answer_no'] = gender;
    if (Array.isArray(question_id)) {
      findQuery['question_id'] = { $in: question_id };
    }
    if (page == undefined) page = 1;

    const limit = 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const datas = await this.surveyModel.find(findQuery).exec();
    datas.reverse();

    const results = datas.slice(startIndex, endIndex);

    return {
      data: results,
      totalLength: datas.length,
    };
  }
}
