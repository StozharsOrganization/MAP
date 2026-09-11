import { NextRequest, NextResponse } from 'next/server';
import { donateToProject, getDonations } from '../../../lib/data/store';
import { verifyAdminSession } from '../../../lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, amount, frequency, paymentMethod, donorName, donorEmail } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Сума внеску повинна бути більшою за нуль' },
        { status: 400 }
      );
    }

    const result = await donateToProject({
      projectId,
      amount: numAmount,
      frequency: frequency || 'once',
      paymentMethod: paymentMethod || 'card',
      donorName,
      donorEmail,
    });

    revalidatePath('/');
    revalidatePath('/projects');

    return NextResponse.json({
      success: true,
      project: result.project,
      newRaisedAmount: result.newRaisedAmount,
      donation: result.donation,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Помилка обробки донату' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const isAuthorized = await verifyAdminSession(['admin']);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Доступ до журналу внесків має лише Головний адміністратор' },
        { status: 403 }
      );
    }

    const donations = await getDonations();
    return NextResponse.json({ success: true, donations });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

