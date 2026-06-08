import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export const PLANS = {
  light: {
    name: 'ライトプラン',
    priceId: process.env.STRIPE_LIGHT_PRICE_ID!,
    amount: 980,
    features: ['月50回生成', 'PDF保存', '透かしなし', '基本解説'],
  },
  pro: {
    name: 'プロプラン',
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    amount: 1980,
    features: [
      '月200回生成',
      'PDF保存',
      '透かしなし',
      '類題生成',
      'テスト対策モード',
      '複数ページ対応',
    ],
  },
}
