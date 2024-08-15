
'use client'

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const {flasjcrds, setFlashcards} = useState([])
    const {flipped, setFlipped} = useState([])
    const {text, setText} = useState('')
    const {name, setName} = useState('')
    const {open, setOpen} = useState(true)
    const router = useRouter

    const handleSubmit = async => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
        .then((res) => res.json())
        .then(data > setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }
}