import { Certificate } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { GenerateCertificatesResponse } from "../../lib/api/GenerateCertificatesResponse"
import rest, { RestError } from "../../lib/api/rest"
import { CertificatesPaginated } from "./CertificatesPaginated"
import { FetchCertificatesParams } from "./FetchCertificatesParams"

rest.setBaseURL(`/api`)

export function useFetchCertificates(params: FetchCertificatesParams) {
  return useQuery<CertificatesPaginated, RestError>(
    ["certificates", params],
    () => rest.get(`/certificates`, params)
  )
}

export function useCreateCertificate() {
  const queryClient = useQueryClient()
  return useMutation<Certificate, RestError, Certificate>(
    (params) => rest.post(`/certificates`, params),
    {
      onSuccess: () => {
        queryClient.refetchQueries("certificates")
      },
    }
  )
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient()
  return useMutation<Certificate, RestError, Certificate>(
    (params) => rest.put(`/certificates/${params.id}`, params),
    {
      onSuccess: () => {
        queryClient.refetchQueries("certificates")
      },
    }
  )
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient()
  return useMutation<Certificate, RestError, Certificate>(
    (params) => rest.delete(`/certificates/${params.id}`),
    {
      onSuccess: () => {
        queryClient.refetchQueries("certificates")
      },
    }
  )
}

export function useDownloadCertificates() {
  return useMutation<void, RestError, number>((certificateId) =>
    rest
      .post(`/certificates/${certificateId}/download`)
      .then((resp: GenerateCertificatesResponse) => {
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
