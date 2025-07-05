import { useEffect } from "react"

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title === "TrendWeight" ? title : `${title} - TrendWeight`

    return () => {
      document.title = previousTitle
    }
  }, [title])
}