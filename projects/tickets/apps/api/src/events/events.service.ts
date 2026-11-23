import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  public async getEvents(): Promise<Event[]> {
    return await this.eventsRepository.find({
      order: { startsAt: 'ASC' },
    });
  }
}
