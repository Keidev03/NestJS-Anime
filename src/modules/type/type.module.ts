import { Module } from '@nestjs/common';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeSchema } from './type.schema';
import { CounterModule } from '../counter/counter.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Type', schema: TypeSchema }]), CounterModule],
  controllers: [TypeController],
  providers: [TypeService],
  exports: [TypeService]
})
export class TypeModule { }
