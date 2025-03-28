import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

// get user by id from param
export async function GET(_request: any, context: any) {
  try {
    await connectDB();
    const userId = context.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

// update user by id from param
export const PUT = auth(async function PUT(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    // @ts-ignore
    if (request.auth?.user?.id !== context?.params?.id) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    const data = await request.json();

    await connectDB();
    const userId = context.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }
    let user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    user.updatedBy = request.auth?.user?.email;
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
      console;
    }
    user = await User.findByIdAndUpdate(userId, data, {
      new: true
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});

// delete user by id from param
export const DELETE = auth(async function DELETE(request: any, context: any) {
  try {
    const allowedRoles = ['admin', 'doctor', 'receptionist'];
    // @ts-ignore
    if (request.auth?.user?.id !== context?.params?.id) {
      if (!allowedRoles.includes(request.auth?.user?.role)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
    await connectDB();
    const userId = context.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }
    let user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    if (
      request.auth?.user?.role === 'admin' ||
      request.auth?.user?.id === user.id
    ) {
      await User.findByIdAndDelete(userId);
      return NextResponse.json({ message: 'User deleted' });
    } else {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
});
