import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Nolan, NolanDto } from './nolan.schema';
import { Survey } from '../Result/survey.schema';
import { Model } from 'mongoose';
import * as cron from 'node-cron';

@Injectable()
export class NolanService {
  private readonly logger = new Logger(NolanService.name);
  question_id: any;
  constructor(
    @InjectModel(Nolan.name) private nolanModel: Model<Nolan>,
    @InjectModel(Survey.name) private surveyModel: Model<Survey>,
  ) {
    cron.schedule('0 0 * * *', async () => {
      console.log(new Date());
      this.question_id = await this.dayNolan();
      console.log(this.question_id);
      this.updateNolan(this.question_id);
    });
  }

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
    if (this.question_id == null) {
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
              type: { $ne: 'AB' },
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
      const questionId = datas.map((item) => item.question_id);
      const resultData = await this.surveyModel
        .aggregate([
          {
            $match: { question_id: { $in: questionId } },
          },
          {
            $group: {
              _id: {
                question_id: '$question_id',
                answer_no: '$answer_no',
              },
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: {
                question_id: '$_id.question_id',
              },
              answers: {
                $push: {
                  answer_no: '$_id.answer_no',
                  count: '$count',
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              question_id: '$_id.question_id',
              answers: 1,
            },
          },
          {
            $project: {
              _id: 0,
              answers: 1,
              question_id: 1,
              difference: {
                $abs: {
                  $subtract: [
                    { $arrayElemAt: ['$answers.count', 0] },
                    { $arrayElemAt: ['$answers.count', 1] },
                  ],
                },
              },
            },
          },
          {
            $sort: {
              difference: 1,
              question_id: 1,
            },
          },
          {
            $limit: 1,
          },
        ])
        .exec();

      const question = resultData.map((item) => item.question_id);
      console.log('questionId is undefiend' + question);
      return this.total(question);
    } else {
      console.log('questionId is exist' + this.question_id);

      return this.total(this.question_id);
    }
  }

  async total(question_id) {
    console.log('total' + question_id);
    const datas = await this.surveyModel
      .aggregate([
        {
          $match: { question_id: { $in: question_id } },
        },
        {
          $lookup: {
            from: 'nolan',
            let: { question_id: '$question_id', answer_no: '$answer_no' },
            pipeline: [
              {
                $unwind: '$answers',
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$question_id', '$$question_id'] },
                      { $eq: ['$answers.answer_no', '$$answer_no'] },
                    ],
                  },
                },
              },
            ],
            as: 'joinedData',
          },
        },
        { $unwind: '$joinedData' },
        {
          $project: {
            _id: 0,
            age: 1,
            gender: 1,
            question_id: 1,
            answer_no: 1,
            answer: '$joinedData.answers.answer',
            today_question: '$joinedData.today_question',
            question: '$joinedData.question',
          },
        },
        {
          $group: {
            _id: {
              question_id: '$question_id',
              answer_no: '$answer_no',
            },
            age: { $first: '$age' },
            gender: { $first: '$gender' },
            answer: { $first: '$answer' },
            today_question: { $first: '$today_question' },
            question: { $first: '$question' },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: '$_id.question_id', // question_id로 다시 그룹화
            counts: {
              $push: {
                answer_no: '$_id.answer_no',
                count: '$count',
                age: '$age',
                gender: '$gender',
                answer: '$answer',
                today_question: '$today_question',
                question: '$question',
              },
            },
            totalcount: { $sum: '$count' },
          },
        },
        {
          $unwind: '$counts',
        },
        {
          $project: {
            _id: 0, // _id 필드를 유지합니다.
            totalcount: 1,
            count: '$counts.count',
            question_id: '$_id',
            answer: '$counts.answer',
            answer_no: '$counts.answer_no',
            question: '$counts.question',
            today_question: '$counts.today_question',
          },
        },
        {
          $group: {
            _id: '$question_id', // question_id로 다시 그룹화
            survey: {
              $push: {
                answer_no: '$answer_no',
                count: '$count',
                age: '$age',
                gender: '$gender',
                answer: '$answer',
                today_question: '$today_question',
                question: '$question',
              },
            },
            totalcount: { $first: '$totalcount' },
          },
        },
      ])
      .sort({ question_id: 1 })
      .exec();

    if (datas && datas.length > 0) {
      const resultWithPercentage = datas.map((item) => {
        const countsWithPercentage = item.survey.map((countItem) => {
          const percentage = (countItem.count / item.totalcount) * 100;
          const formattedPercentage = `${percentage.toFixed(0)}%`;
          return { ...countItem, formattedPercentage };
        });

        return { ...item, survey: countsWithPercentage };
      });
      return resultWithPercentage;
    }
    return datas; // 결과 반환
  }

  async dayNolan() {
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
            type: { $ne: 'AB' },
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
    const questionId = datas.map((item) => item.question_id);
    console.log('dayNolan Quetion_Id' + questionId);
    const resultData = await this.surveyModel
      .aggregate([
        {
          $match: { question_id: { $in: questionId } },
        },
        {
          $group: {
            _id: {
              question_id: '$question_id',
              answer_no: '$answer_no',
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              question_id: '$_id.question_id',
            },
            answers: {
              $push: {
                answer_no: '$_id.answer_no',
                count: '$count',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            question_id: '$_id.question_id',
            answers: 1,
          },
        },
        {
          $project: {
            _id: 0,
            answers: 1,
            question_id: 1,
            difference: {
              $abs: {
                $subtract: [
                  { $arrayElemAt: ['$answers.count', 0] },
                  { $arrayElemAt: ['$answers.count', 1] },
                ],
              },
            },
          },
        },
        {
          $sort: {
            difference: 1,
            question_id: 1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .exec();

    const question = await resultData.map((item) => item.question_id);
    return question;
  }

  async updateNolan(question) {
    const todayDate = new Date();
    this.logger.log('Scheduled function executed at ' + todayDate);
    this.logger.log('Scheduled argument executed at ' + question);
    await this.nolanModel.updateOne(
      { question_id: question },
      { $set: { today_question: todayDate } },
    );
  }
}
