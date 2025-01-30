import { Metadata } from "next"

export const SITE_CONFIG: Metadata = {
  title: {
    default: "Cutiefly - Shorten URLs",
    template: `%s | Cutiefly`,
  },
  description:
    "Cutiefly is a smart URL shortener that makes your links shorter and more efficient in seconds. Fast, secure, and easy to use. Get started for free now! 🚀",
  icons: {
    icon: [
      {
        url: "/icons/favicon.png",
        href: "/icons/favicon.png",
      },
    ],
  },
  openGraph: {
    title: "Cutiefly - Shorten URLs",
    description:
      "Cutiefly is a smart URL shortener that makes your links shorter and more efficient in seconds. Fast, secure, and easy to use. Get started for free now! 🚀",
    images: [
      {
        url: "assets/base.png",
      },
    ],
  },
}
