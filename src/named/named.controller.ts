import { Controller, Get } from '@nestjs/common';
import { NamedService } from './named.service';

@Controller('named')
export class NamedController {
    constructor(
        private namedService: NamedService
    ) {}

    @Get('/data')
    getNamedData() {

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@")

        return this.namedService.getNamedData();    
    }
}
