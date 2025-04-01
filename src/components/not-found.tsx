import { AlertTriangle, Bomb, Skull } from "lucide-react"
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const NotFound = () => {
  const getRandomMessage = () => {
    const messages = [
      "WHAT HAVE YOU DONE?!",
      "ABSOLUTELY DESTROYED!",
      "CATASTROPHIC FAILURE!",
      "EVERYTHING IS BROKEN!",
      "TOTAL OBLITERATION!",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-2xl border-red-500 bg-red-950 p-8">
        <div className="space-y-8">
          <div className="animate-pulse text-center">
            <h1 className="text-8xl font-bold tracking-tighter text-red-500">
              404
            </h1>
          </div>

          <Alert
            variant="destructive"
            className="border-red-500 bg-red-900"
            data-testid="not-found-alert"
          >
            <AlertTriangle className="h-6 w-6" />
            <AlertTitle className="text-2xl font-bold">
              Page Not Found: {getRandomMessage()}
            </AlertTitle>
            <AlertDescription className="mt-2 text-lg">
              The page you're looking for has been completely annihilated.
              There's nothing left but digital ashes.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center space-x-6">
            <Skull className="h-12 w-12 animate-bounce text-red-500" />
            <Bomb className="h-12 w-12 animate-pulse text-red-500" />
            <Skull className="h-12 w-12 animate-bounce text-red-500" />
          </div>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className={buttonVariants({
                variant: "destructive",
                size: "lg",
                className: "bg-red-600 text-lg font-bold hover:bg-red-700",
              })}
            >
              GET OUT OF HERE!
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default NotFound
