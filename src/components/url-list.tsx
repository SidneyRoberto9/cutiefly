import { CopyIcon, EyeIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const UrlList = () => {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">Recent URLs</h2>
      <ul className="space-y-2">
        <li className="flex items-center justify-between gap-2">
          <Link
            href="https://www.pokemon.com/br/pokedex/cutiefly"
            className="text-blue-500"
            target="_blank"
          >
            https://www.pokemon.com/br/pokedex/cutiefly
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted"
            >
              <CopyIcon className="size-4" />
              <span className="sr-only">Copy URL</span>
            </Button>

            <span className="flex items-center">
              <EyeIcon className="size-4" />
              100 views
            </span>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default UrlList
