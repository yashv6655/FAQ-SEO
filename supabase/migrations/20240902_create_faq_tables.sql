-- Create FAQ Projects table
CREATE TABLE IF NOT EXISTS faq_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  topic TEXT,
  product TEXT,
  audience TEXT DEFAULT 'Developers',
  tone TEXT DEFAULT 'clear and helpful',
  num_questions INTEGER DEFAULT 10,
  industry TEXT,
  target_audience TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FAQ Items table
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES faq_projects(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FAQ Generations table (to store API responses)
CREATE TABLE IF NOT EXISTS faq_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES faq_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  product TEXT NOT NULL,
  audience TEXT DEFAULT 'Developers',
  tone TEXT DEFAULT 'clear and helpful',
  num_questions INTEGER DEFAULT 10,
  faqs JSONB NOT NULL,
  jsonld TEXT NOT NULL,
  title TEXT,
  meta_description TEXT,
  notes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faq_projects_user_id ON faq_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_faq_projects_created_at ON faq_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_faq_items_project_id ON faq_items(project_id);
CREATE INDEX IF NOT EXISTS idx_faq_items_order ON faq_items(project_id, order_index);
CREATE INDEX IF NOT EXISTS idx_faq_generations_user_id ON faq_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_faq_generations_project_id ON faq_generations(project_id);
CREATE INDEX IF NOT EXISTS idx_faq_generations_created_at ON faq_generations(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE faq_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_generations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for faq_projects
CREATE POLICY "Users can view their own projects" ON faq_projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" ON faq_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON faq_projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON faq_projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for faq_items
CREATE POLICY "Users can view FAQ items from their own projects" ON faq_items
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM faq_projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create FAQ items for their own projects" ON faq_items
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM faq_projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update FAQ items from their own projects" ON faq_items
  FOR UPDATE USING (
    project_id IN (
      SELECT id FROM faq_projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete FAQ items from their own projects" ON faq_items
  FOR DELETE USING (
    project_id IN (
      SELECT id FROM faq_projects WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for faq_generations
CREATE POLICY "Users can view their own generations" ON faq_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generations" ON faq_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations" ON faq_generations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generations" ON faq_generations
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_faq_projects_updated_at
  BEFORE UPDATE ON faq_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();