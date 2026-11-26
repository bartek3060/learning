import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../events/event.entity';

@Entity({ name: 'purchases' })
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Event, { nullable: false })
  event!: Event;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'int' })
  amountCents!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({ type: 'varchar', length: 255, unique: true })
  idempotencyKey!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  paymentId!: string;
}
