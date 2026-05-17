import { supabase } from './db';

export interface UserProfile {
  email: string;
  name: string;
  avatar: string;
  role: 'author' | 'admin';
}

const DEFAULT_PROFILE: UserProfile = {
  email: 'admin@masandigital.com',
  name: 'Andy Masan',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
  role: 'admin'
};

export const auth = {
  // Check if user is currently logged in
  getCurrentUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;

    // Local Storage check first
    const localSession = localStorage.getItem('masandigital_session');
    if (localSession) {
      try {
        return JSON.parse(localSession) as UserProfile;
      } catch {
        return null;
      }
    }

    return null;
  },

  // Perform login
  async login(email: string, password: string): Promise<UserProfile> {
    // If Supabase is configured, we can attempt to sign in with Supabase Auth
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!error && data.user) {
          const profile: UserProfile = {
            email: data.user.email || email,
            name: data.user.user_metadata?.name || 'Andy Masan',
            avatar: data.user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
            role: 'author'
          };
          localStorage.setItem('masandigital_session', JSON.stringify(profile));
          return profile;
        }
      } catch (err) {
        console.warn('Supabase Auth error, attempting local auth fallback:', err);
      }
    }

    // Local Auth Fallback
    // For demo purposes, we accept: admin@masandigital.com / admin123
    if (email === 'admin@masandigital.com' && password === 'admin123') {
      localStorage.setItem('masandigital_session', JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }

    // Accept custom sign-ups or credentials saved in local users list
    const storedUsers = localStorage.getItem('masandigital_users');
    const usersList: { name: string; email: string; password?: string; avatar?: string }[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    const matchedUser = usersList.find(u => u.email === email && u.password === password);
    if (matchedUser) {
      const profile: UserProfile = {
        email: matchedUser.email,
        name: matchedUser.name,
        avatar: matchedUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
        role: 'author'
      };
      localStorage.setItem('masandigital_session', JSON.stringify(profile));
      return profile;
    }

    throw new Error('Invalid email or password. Please try again.');
  },

  // Perform sign up
  async signup(name: string, email: string, password: string): Promise<UserProfile> {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop'
            }
          }
        });
        if (error) throw error;
        
        if (data.user) {
          const profile: UserProfile = {
            email: data.user.email || email,
            name,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
            role: 'author'
          };
          localStorage.setItem('masandigital_session', JSON.stringify(profile));
          return profile;
        }
      } catch (err) {
        console.warn('Supabase Signup failed, falling back to local registry:', err);
      }
    }

    // Local Registry Fallback
    const storedUsers = localStorage.getItem('masandigital_users');
    const usersList: { name: string; email: string; password?: string; avatar?: string }[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    if (usersList.some(u => u.email === email) || email === 'admin@masandigital.com') {
      throw new Error('User with this email already exists.');
    }

    const newUser = {
      name,
      email,
      password,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop'
    };

    usersList.push(newUser);
    localStorage.setItem('masandigital_users', JSON.stringify(usersList));

    const profile: UserProfile = {
      email,
      name,
      avatar: newUser.avatar,
      role: 'author'
    };
    
    localStorage.setItem('masandigital_session', JSON.stringify(profile));
    return profile;
  },

  // Perform logout
  logout() {
    if (supabase) {
      supabase.auth.signOut();
    }
    localStorage.removeItem('masandigital_session');
  }
};
