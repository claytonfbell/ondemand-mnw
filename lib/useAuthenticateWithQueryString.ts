import { useRouter } from "next/router"
import { useEffect } from "react"
import { useAuthenticate } from "./api/api"

export function useAuthenticateWithQueryString() {
  const { mutateAsync: authenticate, isLoading: isAuthenticating } =
    useAuthenticate()
  const { query, route } = useRouter()
  useEffect(() => {
    if (query.authCode !== undefined && typeof query.authCode === "string") {
      console.log(query.authCode)
      authenticate({ authCode: query.authCode }).finally(() => {
        history.pushState(null, "", location.href.split("?")[0])
      })
    }
  }, [authenticate, query.authCode])

  return { isAuthenticating }
}
