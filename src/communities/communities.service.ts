import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community } from './schema/community.schema';
import { CreateCommunityDto } from './dto/create-community.dto';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectModel(Community.name) private communityModel: Model<Community>,
  ) {}

  async getAllCommunities(limit: number, offset: number) {
    try {
      const communities = await this.communityModel
        .find()
        .limit(limit)
        .skip(offset);

      return communities;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async getCommunityById(communityId: string) {
    try {
      const community = await this.communityModel.findById(communityId);

      return community;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async createCommunity(community: CreateCommunityDto) {
    try {
      const newCommunity = new this.communityModel(community);
      await newCommunity.save();

      return newCommunity;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async updateCommunity(communityId: string, community: CreateCommunityDto) {
    try {
      const updatedCommunity = await this.communityModel.findByIdAndUpdate(
        communityId,
        community,
        { new: true },
      );

      return updatedCommunity;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteCommunity(communityId: string) {
    try {
      const deletedCommunity =
        await this.communityModel.findByIdAndDelete(communityId);

      return deletedCommunity;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async toggleMember(
    communityId: string,
    memberId: string,
    action: 'join' | 'leave',
  ) {
    try {
      const community = await this.communityModel.findById(communityId);
      if (action === 'join') {
        // Check if already added
        if (community.members.includes(memberId)) {
          return community;
        }
        community.members.push(memberId);
      } else {
        // Check if already leaved
        if (!community.members.includes(memberId)) {
          return community;
        }
        community.members = community.members.filter((id) => id !== memberId);
      }
      await community.save();
      return community;
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
