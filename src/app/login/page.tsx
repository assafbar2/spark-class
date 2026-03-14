"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [answer, setAnswer] = useState('')
  const [puzzle, setPuzzle] = useState('What is 5 + 3?')
  const correct = '8'

  const router = useRouter()

  const handleSubmit = () => {
    if (answer === correct) {
      // Mock login, redirect to dashboard
      router.push('/')
    } else {
      alert('Try again!')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-2xl font-bold text-center">Teacher Login</h2>
        <p className="text-center">{puzzle}</p>
        <Input 
          type="text" 
          value={answer} 
          onChange={(e) => setAnswer(e.target.value)} 
          placeholder="Your answer"
        />
        <Button onClick={handleSubmit} className="w-full">Login</Button>
        <p className="text-xs text-center">Kid-proof puzzle</p>
      </div>
    </div>
  )
}