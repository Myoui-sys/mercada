import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Review } from '../../reviews/entities/review.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column()
  brand: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
