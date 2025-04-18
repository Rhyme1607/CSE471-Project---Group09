import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Enhance the prompt for better clothing texture generation
    let enhancedPrompt = prompt;
    if (!enhancedPrompt.toLowerCase().includes('clothing') && 
        !enhancedPrompt.toLowerCase().includes('shirt') && 
        !enhancedPrompt.toLowerCase().includes('t-shirt') && 
        !enhancedPrompt.toLowerCase().includes('design') &&
        !enhancedPrompt.toLowerCase().includes('texture') &&
        !enhancedPrompt.toLowerCase().includes('pattern')) {
      enhancedPrompt = `A clothing design texture with ${enhancedPrompt}`;
    }
    
    // Add specific instructions for texture generation
    enhancedPrompt += ". Create a seamless texture pattern suitable for applying to clothing.";

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const base64Image = data.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error in image generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 