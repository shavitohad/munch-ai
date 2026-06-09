import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai'

const SYSTEM_PROMPT = `אתה שף מקצועי. המשתמש יספק רשימת מצרכים וסוג מטבח.
החזר בדיוק 3 הצעות מתכון בפורמט JSON הבא — ללא טקסט נוסף:

{
  "recipes": [
    {
      "id": "unique-string",
      "name": "שם המתכון",
      "description": "תיאור קצר",
      "cuisine": "סוג מטבח",
      "ingredients": ["מצרך 1", "מצרך 2"],
      "missingIngredients": ["מצרך חסר"],
      "steps": ["שלב 1", "שלב 2"],
      "prepTime": "30 דקות",
      "difficulty": "קל"
    }
  ]
}

כללים:
- השב אך ורק בעברית
- id חייב להיות מחרוזת ייחודית (השתמש ב-uuid קצר)
- difficulty חייב להיות אחד מ: קל / בינוני / מאתגר
- הצע מתכונים שמשתמשים בעיקר במצרכים שסופקו
- missingIngredients הם מצרכים שנדרשים למתכון אך לא סופקו`

export async function POST(req: NextRequest) {
  try {
    const { ingredients, cuisine, notes } = await req.json()

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: { message: 'יש לספק לפחות מצרך אחד' } },
        { status: 400 },
      )
    }

    const trimmedNotes = typeof notes === 'string' ? notes.trim() : ''
    const userMessage =
      `מצרכים: ${ingredients.join(', ')}\n` +
      `סוג מטבח: ${cuisine === 'הכל' ? 'כל סוג מטבח' : cuisine}` +
      (trimmedNotes ? `\nהערות נוספות: ${trimmedNotes}` : '')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    })

    const raw = completion.choices[0]?.message?.content
    if (!raw) throw new Error('Empty response from OpenAI')

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.recipes) || parsed.recipes.length === 0) {
      throw new Error('Invalid recipe structure')
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[/api/recipes]', err)
    return NextResponse.json(
      { error: { message: 'לא הצלחנו לקבל מתכונים, נסה שוב' } },
      { status: 500 },
    )
  }
}
