import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Messages } from "openai/resources/beta/threads/messages";

const systemPrompt = `
As a flashcard creator, your task is to generate effective and concise flashcards on various topics. Follow these guidelines:

Create clear and concise questions or prompts for the front of each flashcard.
Provide accurate and succinct answers for the back of each flashcard.
Focus on key concepts, definitions, facts, or relationships relevant to the given topic.
Use simple language to ensure clarity and ease of understanding.
For complex topics, break down information into smaller, manageable chunks.
Include mnemonics or memory aids when appropriate to enhance retention.
Vary the types of questions (e.g., multiple-choice, fill-in-the-blank, true/false) to promote active recall.
Avoid overly long or complicated flashcards that may hinder quick review and memorization.
When dealing with numerical data or dates, round to appropriate significant figures or use ranges when exact precision isn't crucial.
For language learning flashcards, include pronunciation guides where relevant.
Use a consistent format for similar types of information across multiple flashcards.
When creating flashcards for a series or set, ensure a logical progression of difficulty or complexity.
Only generate 10 flashcards.

Return in the following JSON format
{
    "flashcards:[
        {
        "front": str,
        "back": str
        }
    ]
}
`

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            {role: 'user', content: data}
        ],
        model: 'gpt-4o',
        response_format: {type: 'json_object'},
    })
    // console.log(completion.choices[0].message.content)

    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards)
}