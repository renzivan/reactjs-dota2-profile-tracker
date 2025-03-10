import { Badge } from "../../components/ui/badge"

export function Dashboard() {
  return (
    <div className="mt-6 md:mt-12 flex flex-col items-center">
      <div>
        <div>Example Player ID: 131933530</div>
      </div>
      <div className="flex flex-col items-center flex-wrap md:gap-2 md:flex-row">
        <a className="hover:underline" target="_blank" href="https://github.com/renzivan/reactjs-dota2-profile-tracker">Source Code Repository</a>
        <span className="hidden md:block">|</span>
        <a className="hover:underline" target="_blank" href="mailto:renzivanyapenguio@gmail.com">renzivanyapenguio@gmail.com</a>
      </div>
      <div className="my-5 flex justify-evenly gap-2 max-w-64 flex-wrap">
        <Badge className="font-bold">react.js</Badge>
        <Badge className="font-bold">redux</Badge>
        <Badge className="font-bold">vite</Badge>
        <Badge className="font-bold">apollo-client</Badge>
        <Badge className="font-bold">typescript</Badge>
        <Badge className="font-bold">react-router-dom</Badge>
        <Badge className="font-bold">tailwindcss</Badge>
        <Badge className="font-bold">shadcn-ui</Badge>
      </div>
      <div>
        <a className="font-bold hover:underline" href="https://stratz.com/api" target="_blank">
          Powered by Stratz API
        </a>
      </div>
    </div>
  )
}
