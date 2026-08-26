import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems, { eager: true })
  product: Product;

  @Column({ default: 1 })
  quantity: number;
}
