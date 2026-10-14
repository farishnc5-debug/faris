/**
 * Daily reminder notifications using the browser Notification API.
 * Since there is no background service worker here, the reminder only fires
 * while the app tab is open — a `setInterval` checks the clock against the
 * configured time once a minute and shows a notification once per day.
 */
let timerId: number | null = null;
let lastFiredDateKey: string | null = null;

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function scheduleDailyReminder(hour: number, minute: number) {
  cancelDailyReminder();
  if (!isNotificationSupported()) return;

  timerId = window.setInterval(() => {
    const now = new Date();
    const key = todayKey();
    if (now.getHours() === hour && now.getMinutes() === minute && lastFiredDateKey !== key) {
      lastFiredDateKey = key;
      if (Notification.permission === "granted") {
        new Notification("Time for your 2-minute English workout!", {
          body: "Keep your streak alive — jump into today's lesson.",
          icon: "/favicon.svg"
        });
      }
    }
  }, 30_000);
}

export function cancelDailyReminder() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}
