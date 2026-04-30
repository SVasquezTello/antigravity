'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { User, Shield, Crown } from 'lucide-react';

interface Plan {
  id: string;
  name_en: string;
  name_es: string;
  slug: string;
}

interface App {
  id: string;
  name_en: string;
  name_es: string;
  slug: string;
}

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
  plan_id: string | null;
  created_at: string;
}

interface Override {
  user_id: string;
  app_id: string;
}

interface UsersTableProps {
  users: UserData[];
  plans: Plan[];
  apps: App[];
  initialOverrides: Override[];
}

export function UsersTable({ users: initialUsers, plans, apps, initialOverrides }: UsersTableProps) {
  const { language } = useTranslation();
  const supabase = createClient();
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [overrides, setOverrides] = useState<Override[]>(initialOverrides);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const handleUpdate = async (userId: string, field: 'role' | 'plan_id', value: string | null) => {
    setLoadingId(userId);
    try {
      const { error } = await supabase
        .from('users')
        .update({ [field]: value })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u => u.id === userId ? { ...u, [field]: value } : u));
    } catch (error) {
      console.error('Error updating user:', error);
      alert(language === 'en' ? 'Failed to update user' : 'Error al actualizar usuario');
    } finally {
      setLoadingId(null);
    }
  };

  const toggleOverride = async (userId: string, appId: string) => {
    const isActive = overrides.some(o => o.user_id === userId && o.app_id === appId);
    setLoadingId(`${userId}-${appId}`);
    
    try {
      if (isActive) {
        const { error } = await supabase
          .from('user_app_overrides')
          .delete()
          .eq('user_id', userId)
          .eq('app_id', appId);
        if (error) throw error;
        setOverrides(overrides.filter(o => !(o.user_id === userId && o.app_id === appId)));
      } else {
        const { error } = await supabase
          .from('user_app_overrides')
          .insert({ user_id: userId, app_id: appId });
        if (error) throw error;
        setOverrides([...overrides, { user_id: userId, app_id: appId }]);
      }
    } catch (error) {
      console.error('Error toggling override:', error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-white/70">
        <thead className="text-xs uppercase bg-white/5 text-white/50 border-b border-white/10">
          <tr>
            <th className="px-4 py-3 rounded-tl-xl">{language === 'en' ? 'User' : 'Usuario'}</th>
            <th className="px-4 py-3">{language === 'en' ? 'Role' : 'Rol'}</th>
            <th className="px-4 py-3">{language === 'en' ? 'Plan' : 'Plan'}</th>
            <th className="px-4 py-3">{language === 'en' ? 'App Overrides' : 'Excepciones'}</th>
            <th className="px-4 py-3 rounded-tr-xl">{language === 'en' ? 'Joined' : 'Se unió'}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <React.Fragment key={user.id}>
              <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                      {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.first_name} {user.last_name}</div>
                      <div className="text-xs text-white/40">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <select
                    disabled={loadingId === user.id}
                    value={user.role}
                    onChange={(e) => handleUpdate(user.id, 'role', e.target.value as any)}
                    className="bg-black/40 border border-white/10 rounded-lg text-white text-sm px-2 py-1 outline-none focus:border-primary/50 disabled:opacity-50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <select
                    disabled={loadingId === user.id}
                    value={user.plan_id || ''}
                    onChange={(e) => handleUpdate(user.id, 'plan_id', e.target.value || null)}
                    className="bg-black/40 border border-white/10 rounded-lg text-white text-sm px-2 py-1 outline-none focus:border-primary/50 disabled:opacity-50"
                    style={{ minWidth: '120px' }}
                  >
                    <option value="">{language === 'en' ? 'None' : 'Ninguno'}</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {language === 'en' ? plan.name_en : plan.name_es}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Crown className="w-3 h-3" />
                    {overrides.filter(o => o.user_id === user.id).length} {language === 'en' ? 'Active' : 'Activas'}
                  </button>
                </td>
                <td className="px-4 py-4 text-white/50 text-xs">
                  {new Date(user.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
              </tr>
              {expandedUser === user.id && (
                <tr className="bg-white/[0.03]">
                  <td colSpan={5} className="px-12 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {apps.map(app => {
                        const isActive = overrides.some(o => o.user_id === user.id && o.app_id === app.id);
                        const isLoading = loadingId === `${user.id}-${app.id}`;
                        return (
                          <button
                            key={app.id}
                            disabled={isLoading}
                            onClick={() => toggleOverride(user.id, app.id)}
                            className={`flex items-center gap-2 p-3 rounded-xl border text-xs transition-all ${
                              isActive 
                                ? 'bg-primary/20 border-primary/40 text-white' 
                                : 'bg-black/20 border-white/5 text-white/40 hover:border-white/20'
                            } ${isLoading ? 'opacity-50 animate-pulse' : ''}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary shadow-[0_0_8px_rgba(124, 58, 237,0.8)]' : 'bg-white/10'}`} />
                            {language === 'en' ? app.name_en : app.name_es}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-white/40">
                {language === 'en' ? 'No users found.' : 'No se encontraron usuarios.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
