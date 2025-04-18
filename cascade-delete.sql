-- Enable RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Set up foreign key constraints with CASCADE DELETE
ALTER TABLE api_specs
  DROP CONSTRAINT IF EXISTS api_specs_project_id_fkey,
  ADD CONSTRAINT api_specs_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE;

ALTER TABLE customizations
  DROP CONSTRAINT IF EXISTS customizations_project_id_fkey,
  ADD CONSTRAINT customizations_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE;

ALTER TABLE access_controls
  DROP CONSTRAINT IF EXISTS access_controls_project_id_fkey,
  ADD CONSTRAINT access_controls_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE;

ALTER TABLE domains
  DROP CONSTRAINT IF EXISTS domains_project_id_fkey,
  ADD CONSTRAINT domains_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE;

ALTER TABLE team_members
  DROP CONSTRAINT IF EXISTS team_members_project_id_fkey,
  ADD CONSTRAINT team_members_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE;

ALTER TABLE analytics
  DROP CONSTRAINT IF EXISTS analytics_project_id_fkey,
  ADD CONSTRAINT analytics_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE;
