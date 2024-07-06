import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}
  @Get()
  getCommunities(
    @Query() { limit, offset }: { limit: number; offset: number },
  ) {
    return this.communitiesService.getAllCommunities(limit, offset);
  }

  @Get(':id')
  getCommunity(@Param() { id }: { id: string }) {
    return this.communitiesService.getCommunityById(id);
  }

  @Post()
  createCommunity(@Body() createCommunityDto: CreateCommunityDto) {
    return this.communitiesService.createCommunity(createCommunityDto);
  }

  @Put()
  updateCommunity(@Body() createCommunityDto: CreateCommunityDto) {
    return this.communitiesService.createCommunity(createCommunityDto);
  }

  @Delete(':id')
  deleteCommunity(@Param() { id }: { id: string }) {
    return this.communitiesService.deleteCommunity(id);
  }

  @Put(':id')
  toggleMember(
    @Body()
    { memberId, action }: { memberId: string; action: 'join' | 'leave' },
    @Param() { id }: { id: string },
  ) {
    return this.communitiesService.toggleMember(id, memberId, action);
  }
}
