export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type PaymentMethod = 'card' | 'yappy' | 'ach' | 'pagocash' | 'clave'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type GalleryType = 'photo' | 'video'
export type ChatChannel = 'web' | 'whatsapp' | 'instagram'
export type Language = 'es' | 'en'

export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  birthday?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  client_id?: string
  client_name: string
  client_email?: string
  client_phone?: string
  jump_date: string
  jump_time: string
  participants: number
  jump_type: string
  status: BookingStatus
  deposit_paid: boolean
  total_paid: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  booking_id: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transaction_id?: string
  provider_response?: Record<string, unknown>
  created_at: string
}

export interface GalleryItem {
  id: string
  type: GalleryType
  url: string
  thumbnail_url?: string
  title?: string
  title_en?: string
  description?: string
  description_en?: string
  display_order: number
  published: boolean
  created_at: string
}

export interface FAQ {
  id: string
  question_es: string
  question_en: string
  answer_es: string
  answer_en: string
  display_order: number
  published: boolean
}

export interface BlockedDate {
  id: string
  date: string
  reason?: string
  created_at: string
}
