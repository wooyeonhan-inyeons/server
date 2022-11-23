import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryColumn({ length: 20 })
  id!: string;

  @Column({ length: 500 })
  pw!: string;
}
