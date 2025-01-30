import { ClassValue, clsx } from "clsx"
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: Date) {
  const now = new Date()
  const diffSeconds = differenceInSeconds(now, date)
  const diffMinutes = differenceInMinutes(now, date)
  const diffHours = differenceInHours(now, date)
  const diffDays = differenceInDays(now, date)

  const formattedSeconds = String(diffSeconds).padStart(2, "0")
  const formattedMinutes = String(diffMinutes).padStart(2, "0")
  const formattedHours = String(diffHours).padStart(2, "0")
  const formattedDays = String(diffDays).padStart(2, "0")

  if (diffSeconds < 60) {
    return `${formattedSeconds} sec`
  } else if (diffMinutes < 60) {
    return `${formattedMinutes} min`
  } else if (diffHours < 24) {
    return `${formattedHours} hrs`
  } else {
    return `${formattedDays} days`
  }
}
