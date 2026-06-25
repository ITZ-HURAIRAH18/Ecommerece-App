import Product, { IProductDocument } from '../models/Product'
import User from '../models/User'

export async function getPersonalizedRecommendations(
  userId: string,
  limit = 10
): Promise<IProductDocument[]> {
  const user = await User.findById(userId)
  if (!user) return getTrendingProducts(limit)

  const recentlyViewedIds = user.recentlyViewed
    .sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime())
    .slice(0, 10)
    .map((rv) => rv.productId)

  const recentlyViewedProducts = await Product.find({
    _id: { $in: recentlyViewedIds },
    isActive: true,
  }).lean()

  const categoryIds = [...new Set(recentlyViewedProducts.map((p) => p.category.toString()))]
  const brands = [...new Set(recentlyViewedProducts.filter((p) => p.brand).map((p) => p.brand as string))]

  const recommendations = await Product.find({
    _id: { $nin: recentlyViewedIds },
    isActive: true,
    $or: [
      { category: { $in: categoryIds } },
      ...(brands.length > 0 ? [{ brand: { $in: brands } }] : []),
    ],
  })
    .sort({ ratingsAverage: -1, sold: -1 })
    .limit(limit)
    .lean()

  if (recommendations.length < limit) {
    const existingIds = [...recentlyViewedIds, ...recommendations.map((r) => r._id)]
    const fillers = await Product.find({
      _id: { $nin: existingIds },
      isActive: true,
    })
      .sort({ ratingsAverage: -1, sold: -1 })
      .limit(limit - recommendations.length)
      .lean()

    recommendations.push(...fillers)
  }

  return recommendations as unknown as IProductDocument[]
}

export async function getSimilarProducts(
  productId: string,
  limit = 8
): Promise<IProductDocument[]> {
  const product = await Product.findById(productId).lean()
  if (!product) return []

  return (await Product.find({
    _id: { $ne: productId },
    category: product.category,
    isActive: true,
  })
    .sort({ ratingsAverage: -1, sold: -1 })
    .limit(limit)
    .lean()) as unknown as IProductDocument[]
}

export async function getTrendingProducts(limit = 10): Promise<IProductDocument[]> {
  return (await Product.find({ isActive: true })
    .sort({ sold: -1, ratingsAverage: -1 })
    .limit(limit)
    .lean()) as unknown as IProductDocument[]
}
