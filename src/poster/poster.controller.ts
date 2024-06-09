import { Controller, Post } from '@nestjs/common';
import { PosterService } from './poster.service';

@Controller('sequencer')
export class PosterController {
  constructor(private readonly sequencerService: PosterService) {}

  @Post('start')
  async startPoster() {
    await this.sequencerService.startPoster();
    return 'Poster started';
  }
}
