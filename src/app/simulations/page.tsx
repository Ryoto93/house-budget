'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { runSimulation, getRecurringTransactions, generateSampleWhatIfEvents } from '@/lib/actions/simulation.actions'
import { TransactionType } from '@prisma/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'

// シミュレーションデータポイントの型定義
interface SimulationDataPoint {
  date: string;
  balance: number;
  events?: string;
}

// バリデーションスキーマ
const simulationSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  whatIfEvents: z.array(z.object({
    id: z.string(),
    date: z.date(),
    amount: z.number().min(1, '金額は1円以上を入力してください'),
    type: z.nativeEnum(TransactionType),
    description: z.string().optional(),
  })),
}).refine((data) => data.startDate < data.endDate, {
  message: '開始日は終了日より前の日付を指定してください',
  path: ['endDate'],
})

type SimulationFormData = z.infer<typeof simulationSchema>

// What-if イベントの型定義
interface WhatIfEvent {
  id: string
  date: Date
  amount: number
  type: TransactionType
  description?: string
}

// シミュレーション結果の型定義
interface SimulationResult {
  date: Date
  balance: number
  events: {
    type: 'recurring' | 'whatif'
    description: string
    amount: number
    transactionType: TransactionType
  }[]
}

export default function SimulationsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [simulationResult, setSimulationResult] = useState<SimulationResult[]>([])
  const [whatIfEvents, setWhatIfEvents] = useState<WhatIfEvent[]>([])

  const form = useForm<SimulationFormData>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
      whatIfEvents: [],
    },
  })

  const { isSubmitting } = form.formState

  // サンプルデータを追加
  const addSampleEvents = async () => {
    const sampleEvents = await generateSampleWhatIfEvents()
    setWhatIfEvents(sampleEvents)
    form.setValue('whatIfEvents', sampleEvents)
  }

  // What-if イベントを追加
  const addWhatIfEvent = () => {
    const newEvent: WhatIfEvent = {
      id: `event-${Date.now()}`,
      date: new Date(),
      amount: 0,
      type: TransactionType.expense,
      description: '',
    }
    const updatedEvents = [...whatIfEvents, newEvent]
    setWhatIfEvents(updatedEvents)
    form.setValue('whatIfEvents', updatedEvents)
  }

  // What-if イベントを削除
  const removeWhatIfEvent = (id: string) => {
    const updatedEvents = whatIfEvents.filter(event => event.id !== id)
    setWhatIfEvents(updatedEvents)
    form.setValue('whatIfEvents', updatedEvents)
  }

  // What-if イベントを更新
  const updateWhatIfEvent = (id: string, field: keyof WhatIfEvent, value: string | number | Date | TransactionType | undefined) => {
    if (value === undefined) return
    const updatedEvents = whatIfEvents.map(event =>
      event.id === id ? { ...event, [field]: value } : event
    )
    setWhatIfEvents(updatedEvents)
    form.setValue('whatIfEvents', updatedEvents)
  }

  const onSubmit = async (values: SimulationFormData) => {
    setIsLoading(true)
    try {
      // 定期取引を取得
      const recurringTransactions = await getRecurringTransactions()
      
      // 現在の全口座残高を取得（仮の値）
      const initialBalance = 500000 // TODO: 実際の口座残高を取得

      const result = await runSimulation(
        values.startDate,
        values.endDate,
        initialBalance,
        recurringTransactions,
        values.whatIfEvents
      )

      if (result.success && result.data) {
        setSimulationResult(result.data)
      } else {
        alert(`シミュレーションに失敗しました: ${result.error}`)
      }
    } catch (error) {
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : '予期しないエラー'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // グラフ用データの準備
  const chartData: SimulationDataPoint[] = simulationResult.map(item => ({
    date: new Date(item.date).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    }),
    balance: item.balance,
    events: item.events.length > 0 ? item.events.map(e => e.description).join(', ') : '',
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            キャッシュフロー予測
          </h1>
          <p className="text-gray-600">
            将来の収支をシミュレーションして、キャッシュフローを予測します
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* シミュレーション条件フォーム */}
          <Card>
            <CardHeader>
              <CardTitle>シミュレーション条件</CardTitle>
              <CardDescription>
                予測期間と臨時収支イベントを設定してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* 開始日 */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>開始日</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value}
                            onDateChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 終了日 */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>終了日</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value}
                            onDateChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* What-if イベント */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>臨時収支イベント</FormLabel>
                      <div className="space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSampleEvents}
                        >
                          サンプル追加
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addWhatIfEvent}
                        >
                          イベント追加
                        </Button>
                      </div>
                    </div>

                    {whatIfEvents.map((event, index) => (
                      <div key={event.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">イベント {index + 1}</span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeWhatIfEvent(event.id)}
                          >
                            削除
                          </Button>
                        </div>

                        {/* 日付 */}
                        <div>
                          <label className="text-sm font-medium">日付</label>
                          <DatePicker
                            date={event.date}
                            onDateChange={(date) => updateWhatIfEvent(event.id, 'date', date)}
                          />
                        </div>

                        {/* 金額 */}
                        <div>
                          <label className="text-sm font-medium">金額</label>
                          <Input
                            type="number"
                            value={event.amount}
                            onChange={(e) => updateWhatIfEvent(event.id, 'amount', Number(e.target.value))}
                            placeholder="0"
                          />
                        </div>

                        {/* タイプ */}
                        <div>
                          <label className="text-sm font-medium">タイプ</label>
                          <select
                            value={event.type}
                            onChange={(e) => updateWhatIfEvent(event.id, 'type', e.target.value as TransactionType)}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value={TransactionType.income}>収入</option>
                            <option value={TransactionType.expense}>支出</option>
                          </select>
                        </div>

                        {/* 説明 */}
                        <div>
                          <label className="text-sm font-medium">説明</label>
                          <Input
                            value={event.description}
                            onChange={(e) => updateWhatIfEvent(event.id, 'description', e.target.value)}
                            placeholder="イベントの説明"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 計算実行ボタン */}
                  <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
                    {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {(isSubmitting || isLoading) ? '計算中...' : '計算実行'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* シミュレーション結果 */}
          <Card>
            <CardHeader>
              <CardTitle>予測結果</CardTitle>
              <CardDescription>
                期間中の残高推移を表示します
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">シミュレーションを実行中...</p>
                  </div>
                </div>
              ) : simulationResult.length > 0 ? (
                <div className="space-y-4">
                  {/* 統計情報 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.max(...simulationResult.map(r => r.balance)).toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">最高残高</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {Math.min(...simulationResult.map(r => r.balance)).toLocaleString()}
                      </div>
                      <div className="text-sm text-red-600">最低残高</div>
                    </div>
                  </div>

                  {/* 折れ線グラフ */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                        />
                        <Tooltip
                          formatter={(value: number) => [`${value.toLocaleString()} 円`, '残高']}
                          labelFormatter={(label) => `日付: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="balance"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* イベント一覧 */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">期間中の主要イベント</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {simulationResult
                        .filter(day => day.events.length > 0)
                        .slice(0, 5)
                        .map((day, index) => (
                          <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                            <div className="font-medium">
                              {new Date(day.date).toLocaleDateString('ja-JP')}
                            </div>
                            {day.events.map((event, eventIndex) => (
                              <div key={eventIndex} className="flex items-center space-x-2">
                                {event.transactionType === TransactionType.income ? (
                                  <TrendingUp className="w-3 h-3 text-green-500" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 text-red-500" />
                                )}
                                <span className="text-xs">
                                  {event.description}: {event.amount.toLocaleString()}円
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">シミュレーション結果がありません</p>
                    <p className="text-gray-400 text-sm mt-1">条件を設定して計算を実行してください</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 