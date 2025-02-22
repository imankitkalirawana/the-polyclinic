import { connectDB } from '@/lib/db';
import { phoneValidate } from '@/lib/functions';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// api to register a user
export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectDB();
    const { name, id, password } = data;
    if (!name || !id || !password) {
      return NextResponse.json(
        { message: 'Please enter all fields' },
        { status: 400 }
      );
    }
    if (id.includes('@')) {
      const existingUser = await User.findOne({ email: id });
      if (existingUser) {
        return NextResponse.json(
          { message: 'User already exists' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      let user = new User({ name, email: id, password: hashedPassword });
      user = await user.save();
      return NextResponse.json(
        { message: 'User created successfully', data: user },
        { status: 201 }
      );
    } else if (phoneValidate(id)) {
      const phone = phoneValidate(id);

      if (phone) {
        try {
          const existingUser = await User.findOne({ phone: phone });
          if (existingUser) {
            return NextResponse.json(
              { message: 'User already exists' },
              { status: 404 }
            );
          }
          const hashedPassword = await bcrypt.hash(password, 12);
          const email = `${phone}@insur.com`;
          let user = new User({ name, phone, email, password: hashedPassword });
          user = await user.save();
          return NextResponse.json(
            { message: 'User created successfully', data: user },
            { status: 201 }
          );
        } catch (error: any) {
          return NextResponse.json(
            { message: error.message || 'An error occurred' },
            { status: 400 }
          );
        }
      }
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
