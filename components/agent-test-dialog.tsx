'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  BotMessageSquare,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Clock,
} from 'lucide-react'

type Mode = 'instant' | 'queue'

type Phase =
  | { type: 'idle' }
  | { type: 'submitting' }
  | { type: 'polling'; jobId: string; attempt: number }
  | { type: 'done'; result: Record<string, string>; input: string }
  | { type: 'error'; message: string }

const POLL_INTERVAL_MS = 3_000
const MAX_POLL_ATTEMPTS = 40 // 2 min max

interface AgentTestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AgentTestDialog({ open, onOpenChange }: AgentTestDialogProps) {
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<Mode>('instant')
  const [phase, setPhase] = useState<Phase>({ type: 'idle' })
  const [copied, setCopied] = useState(false)
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const submittedMessageRef = useRef<string>('')

  const stopPolling = () => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }

  const poll = useCallback(async (jobId: string, attempt: number) => {
    if (attempt > MAX_POLL_ATTEMPTS) {
      setPhase({ type: 'error', message: 'Job timed out. Please try again.' })
      return
    }

    setPhase({ type: 'polling', jobId, attempt })

    try {
      const res = await fetch(`/api/agent/${jobId}`)

      if (res.status === 202) {
        // Still pending
        pollTimerRef.current = setTimeout(() => poll(jobId, attempt + 1), POLL_INTERVAL_MS)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setPhase({ type: 'error', message: data.error ?? 'Agent job failed.' })
        return
      }

      setPhase({ type: 'done', result: data, input: submittedMessageRef.current })
    } catch {
      setPhase({ type: 'error', message: 'Network error while polling.' })
    }
  }, [])

  const handleSubmit = async () => {
    if (!message.trim()) return
    stopPolling()
    submittedMessageRef.current = message.trim()
    setPhase({ type: 'submitting' })

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), mode }),
      })

      const data = await res.json()

      if (!res.ok && res.status !== 202) {
        setPhase({ type: 'error', message: data.error ?? 'Request failed.' })
        return
      }

      // 202 → job queued or instant timed out, need to poll
      if (res.status === 202 && data.jobId) {
        poll(data.jobId, 1)
        return
      }

      // 200 → instant result returned directly
      setPhase({ type: 'done', result: data, input: submittedMessageRef.current })
    } catch {
      setPhase({ type: 'error', message: 'Network error. Please try again.' })
    }
  }

  const handleReset = () => {
    stopPolling()
    setPhase({ type: 'idle' })
    setMessage('')
    setCopied(false)
  }

  const handleCopy = () => {
    if (phase.type !== 'done') return
    navigator.clipboard.writeText(JSON.stringify(phase.result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) stopPolling()
    onOpenChange(next)
  }

  const isLoading = phase.type === 'submitting' || phase.type === 'polling'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[900px] w-[90vw] p-0 gap-0 overflow-hidden rounded-2xl">

        {/* Header */}
        <DialogHeader className="px-8 pt-7 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-[#0B5FCC] to-[#1E40AF] rounded-xl flex items-center justify-center shadow-md">
              <BotMessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[#0F172A]">
                Test NIGP Agent
              </DialogTitle>
              <DialogDescription className="text-sm text-[#64748B] mt-0.5">
                Classify an item description using NIGP-JEDI2
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="px-8 py-6 space-y-6">

          {/* Input area — hidden while loading or done */}
          {phase.type === 'idle' && (
            <>
              {/* API usage quick-reference */}
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] divide-y divide-[#E2E8F0] text-xs">
                {/* Header row */}
                <div className="flex items-center gap-2 px-4 py-2.5">
                  <svg className="w-3.5 h-3.5 text-[#0B5FCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                  </svg>
                  <span className="font-semibold text-[#0F172A]">API Reference</span>
                  <span className="ml-auto text-[#94A3B8]">Base URL: <code className="text-[#0B5FCC]">/api/agent</code></span>
                </div>

                {/* Instant mode */}
                <div className="grid grid-cols-[auto_1fr] gap-x-4 px-4 py-3">
                  <div className="flex items-start gap-1.5 pt-0.5">
                    <span className="font-mono font-bold text-[#10B981] bg-[#DCFCE7] px-1.5 py-0.5 rounded">POST</span>
                    <code className="text-[#0F172A] font-mono">/api/agent</code>
                    <span className="text-[#64748B] ml-1">· <code className="bg-[#E0F2FE] text-[#0284C7] px-1 rounded">mode: &quot;instant&quot;</code></span>
                  </div>
                  <p className="text-[#475569] leading-relaxed">
                    Waits up to <strong className="text-[#0F172A]">25 s</strong> for a result. Returns the NIGP JSON directly on success.
                    If Azure AI takes longer, returns <code className="bg-[#F1F5F9] px-1 rounded text-[#0F172A]">&#123; jobId, status: &quot;pending&quot; &#125;</code> — poll to retrieve the result.
                  </p>
                </div>

                {/* Queue mode */}
                <div className="grid grid-cols-[auto_1fr] gap-x-4 px-4 py-3">
                  <div className="flex items-start gap-1.5 pt-0.5">
                    <span className="font-mono font-bold text-[#10B981] bg-[#DCFCE7] px-1.5 py-0.5 rounded">POST</span>
                    <code className="text-[#0F172A] font-mono">/api/agent</code>
                    <span className="text-[#64748B] ml-1">· <code className="bg-[#E0F2FE] text-[#0284C7] px-1 rounded">mode: &quot;queue&quot;</code></span>
                  </div>
                  <p className="text-[#475569] leading-relaxed">
                    Returns <code className="bg-[#F1F5F9] px-1 rounded text-[#0F172A]">&#123; jobId, status: &quot;pending&quot; &#125;</code> immediately (~50 ms).
                    Job processes in the background — use the polling endpoint below.
                  </p>
                </div>

                {/* Poll endpoint */}
                <div className="grid grid-cols-[auto_1fr] gap-x-4 px-4 py-3">
                  <div className="flex items-start gap-1.5 pt-0.5">
                    <span className="font-mono font-bold text-[#0B5FCC] bg-[#DBEAFE] px-1.5 py-0.5 rounded">GET</span>
                    <code className="text-[#0F172A] font-mono">/api/agent/&#123;jobId&#125;</code>
                  </div>
                  <div className="text-[#475569] leading-relaxed space-y-1">
                    <p>Poll until <code className="bg-[#F1F5F9] px-1 rounded text-[#0F172A]">HTTP 200</code> (done) or <code className="bg-[#F1F5F9] px-1 rounded text-[#0F172A]">502</code> (error). Returns <code className="bg-[#F1F5F9] px-1 rounded text-[#0F172A]">202</code> while pending.</p>
                    <p className="text-[#94A3B8]">Jobs expire from Redis after <strong className="text-[#475569]">1 hour</strong>. Recommended poll interval: <strong className="text-[#475569]">3 s</strong> with exponential backoff.</p>
                  </div>
                </div>
              </div>

              {/* Message input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">
                  Item Description
                </label>
                <Textarea
                  placeholder="e.g. Laptop computer, Office chair with lumbar support…"
                  className="resize-none min-h-[120px] text-sm border-[#CBD5E1] focus-visible:ring-[#0B5FCC]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
                  }}
                />
                <p className="text-xs text-[#94A3B8]">Press ⌘ + Enter to submit</p>
              </div>

              {/* Mode toggle */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#0F172A]">Response Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('instant')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      mode === 'instant'
                        ? 'border-[#0B5FCC] bg-[#EFF6FF] text-[#0B5FCC]'
                        : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <Zap className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                      <div>Instant</div>
                      <div className="text-xs font-normal opacity-70">Wait for result</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('queue')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      mode === 'queue'
                        ? 'border-[#0B5FCC] bg-[#EFF6FF] text-[#0B5FCC]'
                        : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <Clock className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                      <div>Queue</div>
                      <div className="text-xs font-normal opacity-70">Poll for result</div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-linear-to-br from-[#0B5FCC] to-[#1E40AF] rounded-2xl flex items-center justify-center shadow-lg">
                  <BotMessageSquare className="w-8 h-8 text-white" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0B5FCC] opacity-50" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-[#0B5FCC] items-center justify-center">
                    <Spinner className="w-3 h-3 text-white" />
                  </span>
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#0F172A]">
                  {phase.type === 'submitting' ? 'Submitting to NIGP-JEDI2…' : 'Classifying item…'}
                </p>
                {phase.type === 'polling' && (
                  <p className="text-xs text-[#64748B] mt-1">
                    Checking result · attempt {phase.attempt}
                  </p>
                )}
              </div>
              {phase.type === 'polling' && (
                <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#0B5FCC] to-[#1E40AF] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((phase.attempt / MAX_POLL_ATTEMPTS) * 100, 95)}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {phase.type === 'done' && (
            <div className="space-y-3">
              {/* Input echo */}
              <div className="flex items-start gap-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-[#64748B] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
                </svg>
                <div className="min-w-0">
                  <p className="text-xs text-[#94A3B8] mb-0.5">Input</p>
                  <p className="text-sm font-medium text-[#0F172A] wrap-break-word">{phase.input}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-sm font-semibold text-[#0F172A]">Classification Result</span>
                </div>
                <Badge className="bg-[#DCFCE7] text-[#15803D] border-0 text-xs">
                  NIGP-JEDI2
                </Badge>
              </div>

              {/* Code block */}
              <div className="relative rounded-xl overflow-hidden border border-[#1E293B]">
                <div className="flex items-center justify-between px-4 py-2 bg-[#0F172A]">
                  <span className="text-xs text-[#64748B] font-mono">json</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
                  >
                    {copied ? (
                      <><Check className="w-3.5 h-3.5 text-[#10B981]" /><span className="text-[#10B981]">Copied!</span></>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" />Copy</>
                    )}
                  </button>
                </div>
                <pre className="bg-[#1E293B] px-5 py-5 text-sm font-mono text-[#E2E8F0] overflow-x-auto leading-loose">
                  <span className="text-[#94A3B8]">{'{'}</span>
                  {Object.entries(phase.result).map(([key, value], i, arr) => (
                    <div key={key} className="pl-4">
                      <span className="text-[#7DD3FC]">&quot;{key}&quot;</span>
                      <span className="text-[#94A3B8]">: </span>
                      <span className="text-[#86EFAC]">&quot;{value}&quot;</span>
                      {i < arr.length - 1 && <span className="text-[#94A3B8]">,</span>}
                    </div>
                  ))}
                  <span className="text-[#94A3B8]">{'}'}</span>
                </pre>
              </div>

              {/* Field summary cards */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { label: 'Category Code', key: 'nigp_category_code' },
                  { label: 'Subcategory Code', key: 'nigp_subcategory_code' },
                  { label: 'Category', key: 'nigp_category_description' },
                  { label: 'Subcategory', key: 'nigp_subcategory_description' },
                ].map(({ label, key }) => (
                  <div key={key} className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
                    <p className="text-xs text-[#64748B] mb-1">{label}</p>
                    <p className="text-sm font-semibold text-[#0F172A] leading-snug">
                      {phase.result[key] ?? '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error state */}
          {phase.type === 'error' && (
            <div className="flex flex-col items-center py-8 gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">Something went wrong</p>
                <p className="text-xs text-[#64748B] mt-1 max-w-[320px]">{phase.message}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Footer actions */}
        <div className="px-8 py-5 flex items-center justify-between gap-3">
          {phase.type === 'idle' ? (
            <>
              <Button variant="outline" onClick={() => handleOpenChange(false)} className="border-[#E2E8F0]">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className="bg-linear-to-r from-[#0B5FCC] to-[#1E40AF] text-white hover:opacity-90 gap-2"
              >
                <BotMessageSquare className="w-4 h-4" />
                Classify Item
              </Button>
            </>
          ) : isLoading ? (
            <>
              <p className="text-xs text-[#64748B] italic">Azure AI is processing…</p>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-[#E2E8F0] text-[#64748B]"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-[#E2E8F0] gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Another
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="border-[#E2E8F0] gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </Button>
                <Button onClick={() => handleOpenChange(false)} className="bg-linear-to-r from-[#0B5FCC] to-[#1E40AF] text-white hover:opacity-90">
                  Done
                </Button>
              </div>
            </>
          )}
        </div>

      </DialogContent>
    </Dialog>
  )
}
