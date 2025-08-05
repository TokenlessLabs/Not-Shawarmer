import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
});

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR("/api/user", fetcher);

  return {
    user: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
