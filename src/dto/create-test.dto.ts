export class CreateTestDto {
  user_login: string;
  test_type: 'theme' | 'exam';
  theme_id?: number;
  is_done?: boolean;
}
