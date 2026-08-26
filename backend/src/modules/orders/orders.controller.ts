import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.checkout(user.userId, dto);
  }

  @Get()
  findMyOrders(@CurrentUser() user: AuthenticatedUser) {
    return this.ordersService.findByUser(user.userId);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const isAdmin = user.role === UserRole.ADMIN;
    return this.ordersService.findById(user.userId, id, isAdmin);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
