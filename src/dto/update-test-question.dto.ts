import { CreateTestQuestionDto } from './create-test-question.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTestQuestionDto extends PartialType(CreateTestQuestionDto) {
  user_answer: number;
}
