import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [summary, setSummary] = useState('')
  const [editing, setEditing] = useState(false)
  const [selectedParents, setSelectedParents] = useState<string[]>([])

  const parents = [
    { id: '1', name: 'Parent 1', email: 'parent1@example.com' },
    { id: '2', name: 'Parent 2', email: 'parent2@example.com' },
    { id: '3', name: 'Parent 3', email: 'parent3@example.com' },
  ]

  const handleUpload = async () => {
    if (files.length === 0) return
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    setSummary(data.summary)
    setEditing(true)
  }

  const handleSend = async () => {
    // Mock send
    alert('Emails sent to selected parents!')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Spark Class</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Photos</CardTitle>
          <CardDescription>Select multiple photos from your device</CardDescription>
        </CardHeader>
        <CardContent>
          <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
          <Button onClick={handleUpload} className="mt-4">Generate Summary</Button>
        </CardContent>
      </Card>

      {editing && (
        <>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Edit Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Select Parents</CardTitle>
            </CardHeader>
            <CardContent>
              {parents.map((parent) => (
                <div key={parent.id} className="flex items-center space-x-2 mb-2">
                  <Checkbox 
                    id={parent.id}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedParents([...selectedParents, parent.id])
                      } else {
                        setSelectedParents(selectedParents.filter(id => id !== parent.id))
                      }
                    }} 
                  />
                  <Label htmlFor={parent.id}>{parent.name} ({parent.email})</Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button onClick={handleSend} className="mt-8">Send Updates</Button>
        </>
      )}
    </div>
  )
}