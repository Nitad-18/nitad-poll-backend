import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { PollWithoutDeletedDate, RequestWithUserId } from 'src/utilities/type';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollService } from './poll.service';

@UseGuards(JwtAuthGuard)
@Controller('polls')
export class PollController {
  constructor(private readonly pollService: PollService, private userService: UserService) {}

  @Post()
  async create(@Body() createPollDto: CreatePollDto, @Res() res: Response) {
    const user: User = await this.userService.findById(createPollDto.userId);
    if (!user) {
      return res.status(404).send();
    }
    const poll: PollWithoutDeletedDate = await this.pollService.create(createPollDto, user);
    return res.status(201).json(poll);
  }

  @Get()
  async findAll(@Res() res: Response) {
    return res.status(200).json(await this.pollService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const poll = await this.pollService.findOne(+id);
    if (!poll) {
      return res.status(404).send();
    }
    return res.status(200).json(poll);
  }

  @Patch(':id')
  async update(
    @Req() req: RequestWithUserId,
    @Param('id') id: string,
    @Body() updatePollDto: UpdatePollDto,
    @Res() res: Response,
  ) {
    const poll = await this.pollService.findOne(+id);
    if (!poll) {
      return res.status(404).send();
    }
    if (poll.author.id !== req.user.id) {
      return res.status(403).send();
    }
    return await this.pollService.updateEntity(poll, updatePollDto);
  }

  @Delete(':id')
  async remove(@Req() req: RequestWithUserId, @Param('id') id: string, @Res() res: Response) {
    const poll = await this.pollService.findOne(+id);
    if (!poll) {
      return res.status(404).send();
    }
    if (poll.author.id !== req.user.id) {
      return res.status(403).send();
    }
    await this.pollService.remove(+id);
    return res.status(204).send();
  }
}