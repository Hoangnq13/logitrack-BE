import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Driver, DriverDocument } from './schemas/driver.schema';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriverService {
    constructor(
        @InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
    ) { }

    async create(createDriverDto: CreateDriverDto): Promise<Driver> {
        const existingDriver = await this.driverModel.findOne({ user: createDriverDto.user as any });
        if (existingDriver) {
            throw new ConflictException('Người dùng này đã trở thành Tài xế');
        }
        const createdDriver = new this.driverModel(createDriverDto);
        return createdDriver.save();
    }

    async findAll(query: any = {}): Promise<Driver[]> {
        return this.driverModel.find(query).populate('user').exec();
    }

    async findAvailable(): Promise<Driver[]> {
        return this.driverModel.find({ isAvailable: true }).populate('user').exec();
    }

    async findOne(id: string): Promise<Driver> {
        const driver = await this.driverModel.findById(id).populate('user').exec();
        if (!driver) {
            throw new NotFoundException(`Không tìm thấy Tài xế có ID: ${id}`);
        }
        return driver;
    }

    async update(id: string, updateDriverDto: UpdateDriverDto): Promise<Driver> {
        const driver = await this.driverModel
            .findByIdAndUpdate(id, updateDriverDto, { new: true })
            .populate('user')
            .exec();

        if (!driver) {
            throw new NotFoundException(`Không tìm thấy Tài xế có ID: ${id}`);
        }
        return driver;
    }

    async remove(id: string): Promise<Driver> {
        // Vô hiệu hóa Tài xế (Soft delete)
        const driver = await this.driverModel.findByIdAndUpdate(
            id,
            { isAvailable: false, status: 'OFFLINE' },
            { new: true }
        ).exec();

        if (!driver) {
            throw new NotFoundException(`Không tìm thấy Tài xế có ID: ${id}`);
        }
        return driver;
    }
}
