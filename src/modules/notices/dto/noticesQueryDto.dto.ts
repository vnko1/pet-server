import { AppDto } from 'src/common';

export class NoticesQueryDto extends AppDto {
  sex?: 'male' | 'female';
  category: 'sell' | 'lost-found' | 'in-good-hands' | 'favorites' | 'owner';
}
