'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react'
import Button  from "@/components/ui/button"
import Textarea from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AnalysisResult {
  error?: string;
}


export default function EmailAnalyzer() {
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [links, setLinks] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] =  useState<AnalysisResult | null>(null);


  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log(reader.result); 
      };
      reader.readAsText(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['image/*'],
      'text/plain': ['text/plain'],
      'audio/*': ['audio/*'],
      'video/*': ['video/*'],
    },
    multiple: true,
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => { },
  });


  const scanForLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.match(urlRegex) || []
  }

  

  const handleInputChange = (e: { target: { value: any } }) => {
    const newInput = e.target.value
    setInput(newInput)
    setLinks(scanForLinks(newInput))
  }

  const analyzeEmail = async () => {
    setIsAnalyzing(true)
    
    try {
      // Simulating API call to Flask backend
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: input, links: links }),
      })
      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Error analyzing email:', error)
      setAnalysisResult({ error: 'Failed to analyze email' })
    }
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader >
          <CardTitle className="text-8xl font-bold text-center" >Email Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-4 mb-4 ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps() as React.InputHTMLAttributes<HTMLInputElement>} />
            <Textarea
              placeholder="Type or paste your email here, or drop files..."
              value={input}
              onChange={handleInputChange}
              className="min-h-[200px] mb-2"
              style={{width:"98%",margin:"0.5"}}
            />
            {isDragActive ? (
              <p className="text-center text-primary">Drop the files here ...</p>
            ) : (
              <p className="text-center text-gray-500">Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>

          {links.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Detected Links:</h3>
              <ul className="list-disc pl-5">
                {links.map((link, index) => (
                  <li key={index} className="text-blue-600 hover:underline">
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={analyzeEmail} disabled={isAnalyzing || input.trim() === ''} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Email'
            )}
          </Button>

          {analysisResult && (
            <Alert className={`mt-4 ${!(analysisResult as {isSuspicious:boolean}).isSuspicious ? 'bg-red-100' : 'bg-green-100'}`}>
              <AlertTitle className="flex items-center">
                
              {((analysisResult as { analysis: string }).analysis === "This email contains suspicious content.") ? (
              <>
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    {(analysisResult as { analysis: string }).analysis|| 'Suspicious Email Detected'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    
                    {(analysisResult as { analysis: string }).analysis|| 'Email Appears Safe'}
                  </>
                )}
              </AlertTitle>
              <AlertDescription>
                {(analysisResult as { analysis: string }).analysis}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}