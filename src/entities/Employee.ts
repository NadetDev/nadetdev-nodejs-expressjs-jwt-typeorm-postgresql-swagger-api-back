import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';

export enum EmployeeStatus {
  ACTIVE = 'active',
  ABSENT = 'absent',
  QUIT = 'quitte',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  prenom: string;

  @Column()
  @IsNotEmpty()
  nom: string;

  @Column()
  @IsNotEmpty()
  fonction: string;

  @Column({ type: 'date' })
  @IsDateString()
  dateRecrutement: Date;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  @IsEnum(EmployeeStatus)
  statut: EmployeeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
