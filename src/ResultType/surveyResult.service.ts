import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SurveyResult, SurveyResultDto } from './surveyResult.schema';
import { Model } from 'mongoose';

@Injectable()
export class SurveyResultService {
  constructor(
    @InjectModel(SurveyResult.name)
    private surveyResultModel: Model<SurveyResult>,
  ) {}

  async create(createSurveyDto: SurveyResultDto): Promise<SurveyResult> {
    const createCat = new this.surveyResultModel(createSurveyDto);

    return createCat.save();
  }

  async findAll({ age, gender, percent, title, page }): Promise<object> {
    const findQuery = {};
    if (age != undefined) findQuery['age'] = age;
    if (gender != undefined) findQuery['gender'] = gender;
    if (title != undefined) findQuery['title'] = title;
    if (percent == undefined) findQuery['percent'] = percent;
    if (page == undefined) page = 1;

    const datas = await this.surveyResultModel
      .aggregate([
        { $match: { findQuery } },
        {
          $group: {
            _id: { age: '$age', gender: '$gender', title: '$title' },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            age: '$_id.age',
            gender: '$_id.gender',
            title: '$_id.title',
          },
        },
      ])
      .exec();

    const results = datas;

    return {
      data: results,
    };
  }
}