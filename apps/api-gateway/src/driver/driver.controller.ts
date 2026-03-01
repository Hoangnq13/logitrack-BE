import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverLocationService } from './driver-location.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('drivers')
// [TEMP] Bypassing auth for testing Driver App
// @UseGuards(JwtAuthGuard, RolesGuard)
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly driverLocationService: DriverLocationService,
  ) { }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.DISPATCHER)
  findAll(
    @Query('status') status?: string,
    @Query('isAvailable') isAvailable?: string,
  ) {
    const query: any = {};
    if (status) query.status = status;
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
    return this.driverService.findAll(query);
  }

  @Get('me')
  @Roles(Role.DRIVER)
  findMe(@Req() req: any) {
    return this.driverService.findMe(req.user.id);
  }

  @Get('available')
  @Roles(Role.ADMIN, Role.DISPATCHER)
  findAvailable() {
    return this.driverService.findAvailable();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DISPATCHER)
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.driverService.remove(id);
  }

  @Post(':id/location')
  @Roles(Role.DRIVER)
  updateLocation(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.driverLocationService.updateLocation(
      id,
      updateLocationDto.lat,
      updateLocationDto.lng,
    );
  }
}
