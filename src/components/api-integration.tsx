import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

const ApiIntegration = () => {
  const codeSnippet = `//example
await fetch('${process.env.NEXT_PUBLIC_BASE_URL}/api/shorter', {
    method: 'POST',
    body: JSON.stringify({
        url: 'https://tracerly.net/',
        code: 'my-custom-code', // optional with maximum 16 characters
        visible: false, // optional not show in recent urls
    }),
})`

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Api Integration</h2>
      <div className="space-y-2">
        <div className="relative min-h-[18.5rem] w-full">
          <div className="absolute bottom-0 left-0 right-0 top-0 overflow-hidden rounded-xl bg-primary">
            <div className="flex bg-primary/40 ring-1 ring-white/5">
              <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                  cutiefly.js
                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="max-h-[18.5rem]">
                <SyntaxHighlighter
                  language="typescript"
                  style={{
                    ...oneDark,
                    'pre[class*="language-"]': {
                      ...oneDark['pre[class*="language-"]'],
                      background: "transparent",
                      overflow: "hidden",
                    },
                    'code[class*="language-"]': {
                      ...oneDark['code[class*="language-"]'],
                      background: "transparent",
                    },
                  }}
                >
                  {codeSnippet}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiIntegration
