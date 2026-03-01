import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Driver, DriverDocument } from './schemas/driver.schema';

@Injectable()
export class DriverLocationService {
  constructor(
    @InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
  ) { }

  async updateLocation(driverId: string, lat: number, lng: number) {
    // 1. Kiểm tra tài xế có tồn tại dưới cơ sở dữ liệu MongoDB không
    const driver = await this.driverModel.findById(driverId).exec();
    if (!driver) {
      throw new NotFoundException(`Không tìm thấy Tài xế có ID: ${driverId}`);
    }

    // 2. Lấy đối tượng kết nối Firestore từ Firebase Admin SDK đã thiết lập ở Sprint 0
    const firestore = admin.firestore();
    const locationRef = firestore.collection('drivers').doc(driverId);

    // 3. Chèn Toạ độ (Upsert / Merge) vào Document trên DB Google Firestore
    try {
      await locationRef.set(
        {
          location: {
            lat,
            lng,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          isOnline: driver.isAvailable,
          status: driver.status,
        },
        { merge: true },
      );

      console.log(`Successfully wrote location for driver ${driverId} to Firestore`);
    } catch (error) {
      console.error('Lỗi khi ghi dữ liệu lên Firestore:', error);
      throw new Error('Không thể lưu tọa độ lên hệ thống Firestore');
    }

    return {
      success: true,
      message: 'Cập nhật toạ độ GPS lên Firestore thành công!',
      data: { lat, lng },
    };
  }
}
