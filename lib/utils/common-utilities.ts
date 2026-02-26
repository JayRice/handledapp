export const fetcher = async <T>(url: string): Promise<T> =>
    fetch(url).then((res) => res.json())