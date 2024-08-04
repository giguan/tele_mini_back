import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTeleUserDto } from './dto/createTeleUserDto';
import { UserService } from './user.service';
import { query } from 'express';
import { Users } from 'src/entities/Users';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get(':userId')
    getTelUserInfo(@Param('id') id: string) {
        return this.userService.telUserInfo(id);
    }

    @Post() 
    postTelUser(@Body() body: CreateTeleUserDto) {
        return this.userService.userCheck(body)
    }    
    

}
