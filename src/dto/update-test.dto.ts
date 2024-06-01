import { CreateTestDto } from './create-test.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTestDto extends PartialType(CreateTestDto) {
  is_done: boolean;
}
