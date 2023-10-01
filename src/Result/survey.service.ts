import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Survey, SurveyDto } from './survey.schema';
import { Model } from 'mongoose';
import { IsNumber } from 'class-validator';

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

    async percentage(question_id) {

        const id = parseInt(question_id);
        const datas = await this.surveyModel.aggregate([
            {
                $match: { "question_id": id }
                },
            {
                $group: {
                    _id: {
                        question_id: "$question_id",
                        answer_no: "$answer_no"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.question_id",
                    counts: {
                        $push: {
                            question_id: "$_id.question_id",
                            answer_no: "$_id.answer_no",
                            count: "$count"
                        }
                    },
                    totalcount: { $sum: "$count" }
                }
            },
            {
                $project: {
                    _id: 0,
                    counts: 1,
                    totalcount: 1
                }
            }
        ]).exec();

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
}
