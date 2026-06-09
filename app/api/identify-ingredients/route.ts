import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()

    if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: { message: 'לא הועלתה תמונה תקינה' } },
        { status: 400 },
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: image, detail: 'low' },
            },
            {
              type: 'text',
              text: 'זהה את כל מצרכי המזון הנראים בתמונה. החזר JSON בלבד בפורמט: {"ingredients": ["מצרך 1", "מצרך 2"]}. השתמש בשמות עבריים קצרים ופשוטים (מילה או שתיים לכל מצרך). אם אין מצרכי מזון בתמונה, החזר רשימה ריקה.',
            },
          ],
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content
    if (!raw) throw new Error('Empty response from OpenAI')

    const parsed = JSON.parse(raw)
    const ingredients = Array.isArray(parsed.ingredients)
      ? (parsed.ingredients as string[]).map((s) => String(s).trim()).filter(Boolean)
      : []

    return NextResponse.json({ ingredients })
  } catch (err) {
    console.error('[/api/identify-ingredients]', err)
    return NextResponse.json(
      { error: { message: 'לא הצלחנו לזהות מצרכים, נסה שוב' } },
      { status: 500 },
    )
  }
}
