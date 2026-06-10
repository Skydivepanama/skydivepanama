-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  birthday DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  jump_date DATE NOT NULL,
  jump_time TIME NOT NULL,
  participants INTEGER DEFAULT 1,
  jump_type TEXT DEFAULT 'tandem',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  deposit_paid BOOLEAN DEFAULT FALSE,
  total_paid DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('card', 'yappy', 'ach', 'pagocash', 'clave')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  provider_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ table
CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_es TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_es TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE
);

-- Blocked dates (admin can block days)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat conversations log
CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel TEXT NOT NULL CHECK (channel IN ('web', 'whatsapp', 'instagram')),
  sender_id TEXT,
  sender_name TEXT,
  message TEXT NOT NULL,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(jump_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sample FAQ data
INSERT INTO faq (question_es, question_en, answer_es, answer_en, display_order) VALUES
('¿Necesito experiencia previa?', 'Do I need prior experience?', 'No, no necesitas ninguna experiencia previa. Nuestros instructores certificados te guiarán en todo momento durante el salto en tándem.', 'No prior experience is needed. Our certified instructors will guide you every step of the way during your tandem jump.', 1),
('¿Cuál es el peso máximo para saltar?', 'What is the maximum weight to jump?', 'El peso máximo es de 230 libras (104 kg). Si tienes dudas, contáctanos.', 'The maximum weight is 230 lbs (104 kg). If you have questions, please contact us.', 2),
('¿Qué incluye el salto tándem?', 'What is included in the tandem jump?', 'Incluye briefing de seguridad, equipo completo, salto con instructor certificado, y aterrizaje. Video y fotos son opcionales.', 'Includes safety briefing, full equipment, jump with certified instructor, and landing. Video and photos are optional.', 3),
('¿Cuánto tiempo dura la experiencia?', 'How long does the experience last?', 'El proceso completo dura aproximadamente 3-4 horas, incluyendo el briefing, espera, vuelo y salto.', 'The complete experience lasts approximately 3-4 hours, including briefing, waiting, flight and jump.', 4),
('¿Puedo cancelar mi reserva?', 'Can I cancel my reservation?', 'Sí, puedes cancelar con al menos 48 horas de anticipación para recibir un reembolso completo.', 'Yes, you can cancel at least 48 hours in advance for a full refund.', 5),
('¿Cuál es el monto mínimo de reserva?', 'What is the minimum reservation amount?', 'El monto mínimo para reservar tu lugar es de $50 USD. Puedes pagar más si deseas.', 'The minimum amount to reserve your spot is $50 USD. You can pay more if you wish.', 6);
