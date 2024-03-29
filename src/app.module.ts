import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NolanModule } from './Nolan/nolan.module';
import { SurveyModule } from './Result/survey.module';
import { SurveyResultModule } from './ResultType/surveyResult.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://ByeNolan:ByeNolan@byenolan.sje6f0n.mongodb.net/',
    ),
    NolanModule,
    SurveyModule,
    SurveyResultModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
