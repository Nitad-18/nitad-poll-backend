import { Poll } from 'src/poll/entities/poll.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ name: 'display_name' })
  displayName: string;

  @OneToMany(() => Poll, poll => poll.author)
  polls: Poll[];

  @ManyToMany(() => Poll, poll => poll.users)
  votedPolls: Poll[];

  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;

  @DeleteDateColumn({ name: 'deleted_date' })
  deletedDate: Date;
}
