import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: AuthenticatedUser) {
    return this.cartService.getOrCreateCart(user.userId);
  }

  @Post('items')
  addItem(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddItemDto) {
    return this.cartService.addItem(user.userId, dto);
  }

  @Patch('items/:itemId')
  updateItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.cartService.updateItem(user.userId, itemId, dto);
  }

  @Delete('items/:itemId')
  removeItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItem(user.userId, itemId);
  }

  @Delete()
  clearCart(@CurrentUser() user: AuthenticatedUser) {
    return this.cartService.clear(user.userId);
  }
}
