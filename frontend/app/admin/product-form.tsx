import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { colors } from '../../constants/colors'
import { spacing } from '../../constants/spacing'
import { typography } from '../../constants/typography'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { adminService } from '../../services/adminService'
import { categoryService } from '../../services/categoryService'

export default function ProductFormScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const queryClient = useQueryClient()
  const isEdit = !!id

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [discountPrice, setDiscountPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [features, setFeatures] = useState('')

  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  })
  const categories = categoriesRes?.data?.data || []

  const { data: productRes } = useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: () => adminService.getProducts().then(r => {
      const p = r.data.data.find((p: any) => p._id === id)
      return p
    }),
    enabled: isEdit,
  })

  useEffect(() => {
    if (productRes) {
      setName(productRes.name || '')
      setDescription(productRes.description || '')
      setPrice(String(productRes.price || ''))
      setDiscountPrice(String(productRes.discountPrice || ''))
      setStock(String(productRes.stock || ''))
      setCategory(productRes.category?._id || '')
      setBrand(productRes.brand || '')
      setFeatures(Array.isArray(productRes.features) ? productRes.features.join('\n') : '')
    }
  }, [productRes])

  const createMutation = useMutation({
    mutationFn: (data: FormData) => adminService.createProduct(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }); router.back() },
    onError: (err: any) => Alert.alert('Error', err?.response?.data?.message || 'Failed to create product'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => adminService.updateProduct(id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }); router.back() },
    onError: (err: any) => Alert.alert('Error', err?.response?.data?.message || 'Failed to update product'),
  })

  const handleSubmit = () => {
    if (!name || !price || !stock) {
      Alert.alert('Missing Fields', 'Name, price, and stock are required.')
      return
    }
    const fd = new FormData()
    fd.append('name', name)
    fd.append('description', description)
    fd.append('price', price)
    if (discountPrice) fd.append('discountPrice', discountPrice)
    fd.append('stock', stock)
    fd.append('category', category)
    if (brand) fd.append('brand', brand)
    if (features) fd.append('features', JSON.stringify(features.split('\n').filter(Boolean)))

    if (isEdit) {
      updateMutation.mutate(fd)
    } else {
      createMutation.mutate(fd)
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{isEdit ? 'Edit Product' : 'New Product'}</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Input label="Name" value={name} onChangeText={setName} placeholder="Product name" />
        <Input label="Description" value={description} onChangeText={setDescription} placeholder="Product description" multiline />
        <Input label="Price" value={price} onChangeText={setPrice} placeholder="0.00" keyboardType="decimal-pad" />
        <Input label="Discount Price" value={discountPrice} onChangeText={setDiscountPrice} placeholder="0.00" keyboardType="decimal-pad" />
        <Input label="Stock" value={stock} onChangeText={setStock} placeholder="0" keyboardType="number-pad" />
        <Input label="Brand" value={brand} onChangeText={setBrand} placeholder="Brand name" />

        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {categories.map((cat: any) => (
            <TouchableOpacity
              key={cat._id}
              style={[styles.chip, category === cat._id && styles.chipActive]}
              onPress={() => setCategory(cat._id)}
            >
              <Text style={[styles.chipText, category === cat._id && styles.chipTextActive]}>
                {cat.icon} {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Input
          label="Features (one per line)"
          value={features}
          onChangeText={setFeatures}
          placeholder="Feature 1&#10;Feature 2"
          multiline
        />

        <Button
          title={isEdit ? 'Update Product' : 'Create Product'}
          onPress={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
          style={styles.submit}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondaryBg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.background,
  },
  back: { ...typography.body, color: colors.primary, fontWeight: '600' },
  title: { ...typography.heading, color: colors.textPrimary },
  form: { padding: spacing.md },
  label: { ...typography.body, color: colors.textPrimary, fontWeight: '600', marginBottom: spacing.sm, marginTop: spacing.md },
  chipRow: { flexDirection: 'row', marginBottom: spacing.md },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20,
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textPrimary },
  chipTextActive: { color: colors.white },
  submit: { marginTop: spacing.lg },
})
