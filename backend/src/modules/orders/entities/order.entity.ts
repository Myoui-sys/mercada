import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'varchar', default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  shippingAddress: string;

  @OneToMany(() => OrderItem, (item) => item.order, {
    eager: true,
    cascade: true,
  })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
