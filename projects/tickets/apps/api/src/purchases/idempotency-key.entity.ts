import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'idempotency_keys' })
export class IdempotencyKey {
  @PrimaryColumn('varchar', { length: 255 })
  key!: string;

  @Column({ type: 'text' })
  requestHash!: string;

  @Column({ type: 'jsonb', nullable: true })
  response: {
    purchaseId: string;
    quantity: number;
    amountCents: number;
  } | null = null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Column({ type: 'int', nullable: true })
  statusCode: number | null = null;
}
