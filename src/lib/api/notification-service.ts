export type NotificationChannel = "email" | "sms" | "push";

export interface NotificationPayload {
  channel: NotificationChannel;
  to: string;
  template: string;
  data: Record<string, string>;
}

/** Mock notification abstraction for booking/tracking events. */
export async function sendNotification(
  payload: NotificationPayload,
): Promise<{ id: string; sent: boolean }> {
  await delay(200);
  return {
    id: `ntf_${Date.now()}`,
    sent: Boolean(payload.to && payload.template),
  };
}

export const notificationService = {
  sendNotification,
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
