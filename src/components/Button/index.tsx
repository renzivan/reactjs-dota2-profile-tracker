import { useNavigate } from "react-router-dom"

type Props = {
  disabled: boolean,
  target: string,
  text: string
}

export default function Button(props: Props) {
  const navigate = useNavigate()

  return (
    <button
      disabled={props.disabled}
      onClick={() => navigate(props.target)}
    >
      {props.text}
    </button>
  )
}
