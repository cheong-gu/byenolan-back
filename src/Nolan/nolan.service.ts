import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nolan, NolanDto } from './nolan.schema';
import { Survey } from '../Result/survey.schema';
import { Model } from 'mongoose';

@Injectable()
export class NolanService {
  constructor(
    @InjectModel(Nolan.name) private nolanModel: Model<Nolan>,
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
  ) {}

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

  async todayNolan() {
    const datas = await this.nolanModel
      .aggregate([
        {
          $match: {
            $expr: {
              $or: [
                { $eq: ['$today_question', null] }, // today_question이 null인 경우
                {
                  $lt: [
                    '$today_question',
                    { $subtract: [new Date(), 7 * 24 * 60 * 60 * 1000] },
                  ],
                }, // 일주일 전 데이터
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            answers: 0,
            category: 0,
            type: 0,
            question: 0,
            today_question: 0,
          },
        },
      ])
      .exec();

    const resultData = this.surveyModel
      .aggregate([
        {
          $match: { question_id: { $in: datas } },
        },
        {
          $group: {
            _id: '$question_id',
            answers: {
              $push: {
                answer_no: '$answer_no',
                count: { $sum: 1 },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            question_id: '$_id',
            answers: 1,
          },
        },
        {
          $project: {
            question_id: 1,
            answers: 1,
            difference: {
              $min: {
                $map: {
                  input: '$answers',
                  as: 'answer',
                  in: {
                    $abs: {
                      $subtract: [
                        '$$answer.count',
                        { $arrayElemAt: ['$answers.count', 0] },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        {
          $sort: {
            difference: 1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .exec();

    return resultData;
  }
}
