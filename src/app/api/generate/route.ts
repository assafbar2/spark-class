import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { xai } from '@ai-sdk/xai'

export const runtime = 'edge' // optional, for faster

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const images = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')
        const mimeType = file.type || 'image/jpeg'
        return {
          type: 'base64' as const,
          data: base64,
          mimeType
        }
      })
    )

    const prompt = `You are a helpful teaching assistant. Analyze these classroom photos and generate a short, positive, engaging summary (2-4 sentences) for parents about today's activities. Focus on creativity, teamwork, learning moments, and fun. Make it warm and exciting. End with an emoji.`

    const { text } = await generateText({
      model: xai('grok-vision-beta'),
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          ...images.map((image: any) => ({
            type: 'image',
            imageUrl: {
              url: `data:${image.mimeType};base64,${image.data}`,
              detail: 'high' as const
            }
          }))
        ]
      }],
      maxTokens: 200,
      temperature: 0.7,
    })

    return NextResponse.json({ summary: text.trim() })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}