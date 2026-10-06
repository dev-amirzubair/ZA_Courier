import { NextResponse } from "next/server";
import { z } from "zod";
import { saveContact } from "@/lib/store/memory-db";
import { notificationService } from "@/lib/api/notification-service";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const record = {
      id: `MSG-${Date.now().toString().slice(-8)}`,
      name: body.name,
      email: body.email,
      message: body.message,
      createdAt: new Date().toISOString(),
    };
    saveContact(record);
    await notificationService.sendNotification({
      channel: "email",
      to: "support@zacourier.com.au",
      template: "contact_form",
      data: { from: body.email, name: body.name },
    });

    return NextResponse.json({ ok: true, id: record.id });
  } catch {
    return NextResponse.json(
      { error: "Unable to send your message." },
      { status: 400 },
    );
  }
}
