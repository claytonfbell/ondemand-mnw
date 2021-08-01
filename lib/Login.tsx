import { Alert } from "@mui/material"
import { Form } from "material-ui-pack"
import React, { useState } from "react"
import { useLogin } from "./api/api"
import { LoginRequest } from "./api/LoginRequest"
import { useAuthenticateWithQueryString } from "./useAuthenticateWithQueryString"

export function Login() {
  const [state, setState] = useState<LoginRequest>({
    email: "",
  })

  const { mutateAsync: login, isLoading, error } = useLogin()

  function handleSubmit() {
    login(state).then((result) => setSuccessMessage(result.message))
  }

  const [successMessage, setSuccessMessage] = useState<string>()

  const { isAuthenticating } = useAuthenticateWithQueryString()

  return isAuthenticating ? (
    <>Authenticating...</>
  ) : successMessage === undefined ? (
    <Form
      size="medium"
      error={error?.message}
      busy={isLoading}
      state={state}
      setState={setState}
      onSubmit={handleSubmit}
      submitLabel="Login"
      schema={{
        email: "email",
      }}
      layout={{
        submitButton: { xs: 12 },
      }}
    />
  ) : (
    <Alert severity="success">{successMessage}</Alert>
  )
}
