import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SurveyResult, SurveyResultDto } from './surveyResult.schema';
import { Result } from './result.schema';
import { Model } from 'mongoose';

@Injectable()
export class SurveyResultService {
  constructor(
    @InjectModel(SurveyResult.name)
    private surveyResultModel: Model<SurveyResult>,
    @InjectModel(Result.name)
    private resultModel: Model<Result>,
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
    if (percent != undefined) findQuery['percent'] = percent;
    if (page == undefined) page = 1;

    const datas = await this.surveyResultModel
      .aggregate([
        { $match: findQuery },
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
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ])
      .exec();

    let totalCount = 0;
    if (datas && datas.length > 0) {
      datas.map((item) => {
        totalCount += item.count;
        return { ...item };
      });
    }

    if (datas && datas.length > 0) {
      const result = datas.map((item) => {
        const percentage = (item.count / totalCount) * 100;
        const percent = `${percentage.toFixed(0)}%`;
        return { ...item, percent };
      });
      return result;
    }

    return datas;
  }

  async findResult(percent) {
    percent = parseInt(percent);
    const datas = await this.resultModel
      .aggregate([
        {
          $match: {
            $expr: {
              $gt: ['$percent', percent],
            },
          },
        },
        { $project: { _id: 0, percent: 0 } },
        { $limit: 1 },
      ])
      .exec();
    if (datas && datas.length > 0) {
      const datasResult = datas.map((item) => {
        const percentResult = percent;
        return { ...item, percentResult };
      });
      return datasResult;
    }

    return datas;
  }
}
