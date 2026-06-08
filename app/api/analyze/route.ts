import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { type GenerationMode, type Plan } from '@/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const DAILY_LIMITS: Record<Plan, number> = {
  free: 3,
  light: 50,
  pro: 200,
}

const SYSTEM_PROMPTS: Record<GenerationMode, string> = {
  simple: `あなたは学習補助AIです。問題画像を読み取り、シンプルな解答と解説を生成してください。`,
  detailed: `あなたは学習補助AIです。問題画像を読み取り、詳細な途中式・考え方・解説を含む学習プリントを生成してください。`,
  review: `あなたは学習補助AIです。問題画像を読み取り、テスト前の復習に最適なプリント形式の解説を生成してください。重要ポイントとよくあるミスを特に強調してください。`,
  test_prep: `あなたは学習補助AIです。問題画像を読み取り、テスト対策に特化した解説を生成してください。出題パターン・頻出事項・公式を重視してください。`,
  similar_questions: `あなたは学習補助AIです。問題画像を読み取り、解説とともに類似問題を3問以上生成してください。`,
}

const BASE_PROMPT = `
問題画像を分析して、以下のJSON形式で回答を返してください。
必ず有効なJSONのみを返し、前後に説明文や\`\`\`は不要です。

{
  "subject": "教科名（例：数学、英語、理科）",
  "unit": "単元名（例：二次方程式、英文法、化学反応）",
  "title": "問題タイトル（簡潔に）",
  "detected_problem": "読み取った問題文（できるだけ正確に）",
  "answer": "最終的な答え",
  "steps": [
    {
      "title": "ステップのタイトル",
      "formula": "数式や重要な式（ない場合は空文字）",
      "explanation": "このステップの説明"
    }
  ],
  "key_points": ["重要ポイント1", "重要ポイント2"],
  "common_mistakes": ["よくあるミス1", "よくあるミス2"],
  "similar_questions": [
    {
      "question": "類題の問題文",
      "answer": "類題の答え",
      "explanation": "類題の解説"
    }
  ],
  "summary": "この問題で学べることのまとめ（1〜2文）"
}

stepsは問題の種類に応じて3〜8ステップ程度を目安に。
similar_questionsは類題生成モード以外は1〜2問でも構いません。
問題が読み取れない場合でも、JSONフォーマットを維持し、detected_problemに「画像から問題を読み取れませんでした」と記載してください。
`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, generation_count')
      .eq('id', user.id)
      .single()

    const plan = (profile?.plan ?? 'free') as Plan

    // Check daily limit
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: dailyCount } = await supabase
      .from('generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())

    const dailyLimit = DAILY_LIMITS[plan]
    if ((dailyCount ?? 0) >= dailyLimit) {
      return NextResponse.json(
        { error: `本日の生成上限（${dailyLimit}回）に達しました。プランをアップグレードしてください。` },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const image = formData.get('image') as File
    const mode = (formData.get('mode') as GenerationMode) || 'detailed'

    if (!image) {
      return NextResponse.json({ error: '画像が必要です' }, { status: 400 })
    }

    // Upload image to Supabase Storage
    const fileExt = image.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('problem-images')
      .upload(fileName, buffer, {
        contentType: image.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: '画像のアップロードに失敗しました' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('problem-images')
      .getPublicUrl(uploadData.path)

    // Convert image to base64 for OpenAI
    const base64 = buffer.toString('base64')
    const mimeType = image.type

    // Call OpenAI Vision API
    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.detailed

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: BASE_PROMPT,
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    })

    const rawContent = completion.choices[0]?.message?.content ?? ''

    let aiResult
    try {
      const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      aiResult = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'AIの解析結果を解析できませんでした' }, { status: 500 })
    }

    // Save to database
    const { data: generation, error: dbError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        subject: aiResult.subject || '',
        unit: aiResult.unit || '',
        title: aiResult.title || '無題',
        mode,
        ai_result: aiResult,
        pdf_url: null,
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'データの保存に失敗しました' }, { status: 500 })
    }

    // Update generation count
    await supabase.rpc('increment_generation_count', { user_id: user.id })

    // Log usage
    await supabase.from('usage_logs').insert({
      user_id: user.id,
      action: `generate_${mode}`,
    })

    return NextResponse.json({ id: generation.id })
  } catch (error) {
    console.error('Analyze error:', error)
    return NextResponse.json({ error: '解析に失敗しました' }, { status: 500 })
  }
}
