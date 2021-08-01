import { logo } from "./logo"
interface Props {
  scale: number
}

export function LogoComponent(props: Props) {
  return <div dangerouslySetInnerHTML={{ __html: logo(props.scale) }} />
}
