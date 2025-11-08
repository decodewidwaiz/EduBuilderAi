import { supabase } from '../lib/supabaseClient';
import { AnimationSequence } from '../types/animations';

export const animationService = {
  async saveAnimation(animation: AnimationSequence, isPublic: boolean = false) {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('animations')
      .insert({
        user_id: session.session.user.id,
        title: animation.title,
        description: animation.description,
        topic: animation.topic,
        data: animation,
        difficulty: animation.difficulty,
        tags: animation.tags,
        is_public: isPublic,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMyAnimations() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('animations')
      .select('*')
      .eq('user_id', session.session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPublicAnimations() {
    const { data, error } = await supabase
      .from('animations')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getAnimationById(id: string) {
    const { data, error } = await supabase
      .from('animations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateAnimation(id: string, updates: Partial<AnimationSequence>) {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('animations')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', session.session.user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAnimation(id: string) {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('animations')
      .delete()
      .eq('id', id)
      .eq('user_id', session.session.user.id);

    if (error) throw error;
  },

  async searchAnimations(query: string) {
    const { data, error } = await supabase
      .from('animations')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,topic.ilike.%${query}%`)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getAnimationsByTopic(topic: string) {
    const { data, error } = await supabase
      .from('animations')
      .select('*')
      .eq('topic', topic)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};
