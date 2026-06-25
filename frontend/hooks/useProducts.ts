import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService'

export function useProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeatured(),
  })
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => productService.getNewArrivals(),
  })
}

export function useRelatedProducts(id: string) {
  return useQuery({
    queryKey: ['products', 'related', id],
    queryFn: () => productService.getRelated(id),
    enabled: !!id,
  })
}

export function useSearch(params: Record<string, string>) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => productService.search(params),
    enabled: !!params.q,
  })
}

export function useSuggestions(q: string) {
  return useQuery({
    queryKey: ['suggestions', q],
    queryFn: () => productService.getSuggestions(q),
    enabled: q.length > 1,
  })
}
