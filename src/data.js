import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://dexbvustuzzghzdpetjr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRleGJ2dXN0dXp6Z2h6ZHBldGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NjQ4NTEsImV4cCI6MjA2NTE0MDg1MX0.h3PbDOoiLj9gQmaGJkRWZL7vN_M52Qboik4EFjqpavA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function fetchAssignments() {
  const { data, error } = await supabase
    .from('assignments')
    .select('*');
  if (error) throw new Error(error.message);
  return data.map(row => ({
    date: row.due_date.slice(0, 10),
    chambres: row.title ? row.title.split('/').map(s => s.trim()).filter(Boolean) : [],
  }));
}

export async function saveAssignments(assignments) {
  if (assignments.length === 0) return;
  const months = Array.from(new Set(assignments.map(a => a.date.slice(0, 7))));
  const { data: exist, error: errExist } = await supabase
    .from('assignments')
    .select('id, due_date');
  if (errExist) throw new Error(errExist.message);
  const toDelete = exist
    .filter(a => months.includes(a.due_date.slice(0, 7)))
    .map(a => a.id);
  if (toDelete.length) {
    const { error: errDel } = await supabase
      .from('assignments')
      .delete()
      .in('id', toDelete);
    if (errDel) throw new Error(errDel.message);
  }
  const cleanAssignments = assignments
    .filter(a => a.chambre && a.chambre !== '')
    .map(a => ({ title: a.chambre, due_date: a.date }));
  if (cleanAssignments.length) {
    const { error: errInsert } = await supabase
      .from('assignments')
      .insert(cleanAssignments);
    if (errInsert) throw new Error(errInsert.message);
  }
}

export async function saveAssignment(date, chambre) {
  if (chambre) {
    const { error } = await supabase
      .from('assignments')
      .upsert({ title: chambre, due_date: date }, { onConflict: ['due_date'] });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('due_date', date);
    if (error) throw new Error(error.message);
  }
}

export async function deleteAssignments(dates) {
  if (!dates.length) return;
  const { error } = await supabase
    .from('assignments')
    .delete()
    .in('due_date', dates);
  if (error) throw new Error(error.message);
}

// ---------- Gestion des configurations sauvegardées ----------

export async function fetchConfigList() {
  const { data, error } = await supabase
    .from('admin_configs')
    .select('id, name')
    .order('name');
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchConfig(id) {
  const { data, error } = await supabase
    .from('admin_configs')
    .select('id, name, excluded, linked')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createConfig(name, excluded, linked) {
  const { error } = await supabase.from('admin_configs').insert({
    name,
    excluded,
    linked,
  });
  if (error) throw new Error(error.message);
}

export async function updateConfig(id, updates) {
  const { error } = await supabase
    .from('admin_configs')
    .update(updates)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteConfig(id) {
  const { error } = await supabase
    .from('admin_configs')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchAdminPass() {
  const { data, error } = await supabase
    .from('admin_configs')
    .select('admin_pass')
    .order('id')
    .limit(1)
    .single();
  if (error) throw new Error(error.message);
  return data ? data.admin_pass : null;
}

export async function updateAdminPass(newPass) {
  const first = await supabase
    .from('admin_configs')
    .select('id')
    .order('id')
    .limit(1)
    .single();
  if (first.error) throw new Error(first.error.message);
  if (!first.data) throw new Error('No config row');
  const { error } = await supabase
    .from('admin_configs')
    .update({ admin_pass: newPass })
    .eq('id', first.data.id);
  if (error) throw new Error(error.message);
}
