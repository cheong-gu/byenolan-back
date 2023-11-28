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
    if (answer_no != undefined) findQuery['answer_no'] = answer_no;
    if (Array.isArray(question_id)) {
      findQuery['question_id'] = { $in: question_id };
    }
    if (page == undefined) page = 1;

    const datas = await this.surveyModel.find(findQuery).exec();
    datas.reverse();

    const results = datas;

    return {
      data: results,
      totalLength: datas.length,
    };
  }

  async percentage(question_id) {
    const id = parseInt(question_id);
    const datas = await this.surveyModel
      .aggregate([
        {
          $match: { question_id: id },
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
            _id: '$_id.question_id',
            counts: {
              $push: {
                question_id: '$_id.question_id',
                answer_no: '$_id.answer_no',
                count: '$count',
              },
            },
            totalcount: { $sum: '$count' },
          },
        },
        {
          $project: {
            _id: 0,
            counts: 1,
            totalcount: 1,
          },
        },
      ])
      .exec();

    if (datas && datas.length > 0) {
      const resultWithPercentage = datas.map((item) => {
        const countsWithPercentage = item.counts.map((countItem) => {
          const percentage = (countItem.count / item.totalcount) * 100;
          const formattedPercentage = `${percentage.toFixed(0)}%`;
          return { ...countItem, formattedPercentage };
        });

        return { ...item, counts: countsWithPercentage };
      });
      return resultWithPercentage;
    }
    return datas; // 결과 반환
  }

  async total(question_id) {
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
}
