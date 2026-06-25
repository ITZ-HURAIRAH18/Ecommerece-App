import { Expo, ExpoPushMessage } from 'expo-server-sdk'

const expo = new Expo()

export async function sendPushNotification(
  pushTokens: string[],
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  const validTokens = pushTokens.filter((token) => Expo.isExpoPushToken(token))

  if (validTokens.length === 0) return

  const messages: ExpoPushMessage[] = validTokens.map((token) => ({
    to: token,
    sound: 'default',
    title,
    body,
    data: (data ?? {}) as Record<string, unknown>,
  }))

  const chunks = expo.chunkPushNotifications(messages)

  for (const chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk)

      for (const receipt of receipts) {
        if (receipt.status === 'error' && receipt.details?.error) {
          console.error(`Push notification error: ${receipt.details.error}`)
        }
      }
    } catch (error) {
      console.error('Failed to send push notification chunk:', error)
    }
  }
}
