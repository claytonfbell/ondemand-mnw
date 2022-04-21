import { MuxAsset, Webinar, WebinarsOnUsers } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { AuthcodeRequestResponse } from "./AuthcodeRequestResponse"
import { AuthenticationRequest } from "./AuthenticationRequest"
import { CreateMuxAssetRequest } from "./CreateMuxAssetRequest"
import { FetchMuxAssetResponse } from "./FetchMuxAssetResponse"
import { GenerateDiplomasRequest } from "./GenerateDiplomasRequest"
import { GenerateDiplomasResponse } from "./GenerateDiplomasResponse"
import { LoginRequest } from "./LoginRequest"
import { LoginResponse } from "./LoginResponse"
import rest, { RestError } from "./rest"
import { UploadRequest } from "./UploadRequest"
import { UploadResponse } from "./UploadResponse"
import { UserActivityLogWithUser } from "./UserActivityLogWithUser"
import { UserWithWebinars } from "./UserWithWebinars"
import { WebinarWithMuxAssets } from "./WebinarWithMuxAssets"

rest.setBaseURL(`/api`)

export function useCheckLogin() {
  return useQuery<LoginResponse, RestError>(
    ["login"],
    () => rest.get(`/login`),
    {
      retry: false,
    }
  )
}

export function useLogin() {
  return useMutation<AuthcodeRequestResponse, RestError, LoginRequest>((req) =>
    rest.post(`/login`, req)
  )
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation<void, RestError>(() => rest.delete(`/login`), {
    onSuccess: () => {
      queryClient.setQueryData(["login"], undefined)
    },
  })
}

export function useAuthenticate() {
  const queryClient = useQueryClient()
  return useMutation<LoginResponse, RestError, AuthenticationRequest>(
    (req) => rest.post(`/authenticate`, req),
    {
      onSuccess: (data) => {
        queryClient.setQueryData("login", data)
      },
    }
  )
}

/////////////////

export function useCreateWebinar() {
  const queryClient = useQueryClient()

  return useMutation<Webinar, RestError, Webinar>(
    (data) => rest.post(`/webinars`, data),
    {
      onSuccess: () => {
        queryClient.refetchQueries("webinars")
      },
    }
  )
}

export function useFetchAllWebinars() {
  return useQuery<WebinarWithMuxAssets[], RestError>(["webinars"], () =>
    rest.get(`/webinars`)
  )
}

export function useFetchWebinar(id: number) {
  return useQuery<Webinar, RestError>(["webinars", id], () =>
    rest.get(`/webinars/${id}`)
  )
}

export function useUpdateWebinar() {
  const queryClient = useQueryClient()
  return useMutation<WebinarWithMuxAssets, RestError, WebinarWithMuxAssets>(
    (data) => rest.put(`/webinars/${data.id}`, data),
    {
      onSuccess: () => {
        queryClient.refetchQueries("webinars")
      },
    }
  )
}

export function useDeleteWebinar() {
  const queryClient = useQueryClient()
  return useMutation<void, RestError, Webinar>(
    (data) => rest.delete(`/webinars/${data.id}`),
    {
      onSuccess: () => {
        queryClient.refetchQueries("webinars")
      },
    }
  )
}

/////////////////

export function useFetchAllMuxAssets() {
  return useQuery<MuxAsset[], RestError>(["muxAssets"], () =>
    rest.get(`/muxAssets`)
  )
}

export function useFetchMuxAsset(assetId: string) {
  return useQuery<FetchMuxAssetResponse, RestError>(
    ["muxAssets", assetId],
    () => rest.get(`/muxAssets/${assetId}`)
  )
}

export function useCreateUpload() {
  return useMutation<UploadResponse, RestError, UploadRequest>((data) =>
    rest.post(`/muxAssets/upload`, data)
  )
}

export function useCreateMuxAsset() {
  const queryClient = useQueryClient()
  return useMutation<FetchMuxAssetResponse, RestError, CreateMuxAssetRequest>(
    (data) => rest.post(`/muxAssets`, data),
    {
      onSuccess: () => {
        queryClient.refetchQueries("muxAssets")
      },
    }
  )
}

export function useUpdateMuxAsset() {
  const queryClient = useQueryClient()
  return useMutation<MuxAsset, RestError, MuxAsset>(
    (data) => rest.put(`/muxAssets/${data.id}`, data),
    {
      onSuccess: () => {
        queryClient.refetchQueries("muxAssets")
        queryClient.refetchQueries("webinars")
      },
    }
  )
}

export function useDeleteMuxAsset() {
  const queryClient = useQueryClient()
  return useMutation<void, RestError, string>(
    (assetId) => rest.delete(`/muxAssets/${assetId}`),
    {
      onSuccess: () => {
        queryClient.refetchQueries("muxAssets")
        queryClient.refetchQueries("webinars")
      },
    }
  )
}

/////////////////

export function useFetchUserActivities() {
  return useQuery<UserActivityLogWithUser[], RestError>(
    ["userActivities"],
    () => rest.get(`/userActivities`)
  )
}

/////////////////

export function useFetchUsers() {
  return useQuery<UserWithWebinars[], RestError>(["users"], () =>
    rest.get(`/users`)
  )
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation<void, RestError, { email: string }>(
    (params) => rest.post(`/users`, params),
    {
      onSuccess: () => {
        queryClient.refetchQueries("users")
      },
    }
  )
}

export function useFetchUser(userId: number | undefined) {
  return useQuery<UserWithWebinars, RestError>(
    ["users", userId],
    () => rest.get(`/users/${userId}`),
    { enabled: userId !== undefined }
  )
}

export function useUpsertWebinarOnUser() {
  const queryClient = useQueryClient()
  return useMutation<void, RestError, WebinarsOnUsers>(
    (params) =>
      rest.put(`/users/${params.userId}/webinars/${params.webinarId}`, params),
    {
      onSuccess: () => {
        queryClient.refetchQueries("users")
      },
    }
  )
}

export function useDeleteWebinarOnUser() {
  const queryClient = useQueryClient()
  return useMutation<void, RestError, WebinarsOnUsers>(
    ({ userId, webinarId }) =>
      rest.delete(`/users/${userId}/webinars/${webinarId}`),
    {
      onSuccess: () => {
        queryClient.refetchQueries("users")
      },
    }
  )
}

export function useGenerateDiplomas() {
  return useMutation<void, RestError, GenerateDiplomasRequest>((params) =>
    rest.post(`/diplomas`, params).then((resp: GenerateDiplomasResponse) => {
      downloadBase64File(resp.base64, resp.filename)
    })
  )
}

function downloadBase64File(contentBase64: string, fileName: string) {
  const linkSource = `data:application/zip;base64,${contentBase64}`
  const downloadLink = document.createElement("a")
  document.body.appendChild(downloadLink)

  downloadLink.href = linkSource
  downloadLink.target = "_self"
  downloadLink.download = fileName
  downloadLink.click()
}
