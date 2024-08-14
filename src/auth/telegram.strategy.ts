import { Strategy } from 'passport-strategy';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class TelegramStrategy extends PassportStrategy(Strategy, 'telegram') {
  constructor(

    @InjectRepository(Users)
    private userRepository: Repository<Users>,

  ) {
    super();
    // 여기에 텔레그램 인증 로직을 구현합니다.
  }

  // authenticate 메서드 구현
  async authenticate(req: any) {
    // 여기서 텔레그램 인증 로직을 처리합니다.
    const telegramUserId = req.body.user_id; // 예시: 텔레그램 사용자 ID를 요청에서 가져옴

    if (!telegramUserId) {
        return this.fail('No Telegram user ID found', 401);
    }

    const user = await this.userRepository.findOne({ where: { teleId: telegramUserId } });

    if (!user) {
        return this.fail('Unauthorized', 401);
    }

    this.success(user);

  }

//   validateUser(telegramUserId: string): any {
//     // 여기에 실제 사용자 검증 로직을 구현합니다.
//     // 예를 들어, 데이터베이스에서 사용자를 조회하는 로직을 넣을 수 있습니다.
//     // 여기서는 간단하게 예시를 들자면:
//     const user = { id: telegramUserId, name: 'Telegram User' }; // 가짜 사용자
//     return user;
//   }
}
