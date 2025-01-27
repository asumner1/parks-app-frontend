import { supabase, getUser } from '@/lib/supabase';

type Subscriber = (user: any) => void;

class UserStore {
  private static instance: UserStore;
  private user: any = null;
  private loading: boolean = true;
  private subscribers = new Set<Subscriber>();
  private authSubscription: any = null;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    console.log('[UserStore] Creating new instance');
  }

  static getInstance(): UserStore {
    if (!UserStore.instance) {
      console.log('[UserStore] Initializing singleton instance');
      UserStore.instance = new UserStore();
    }
    return UserStore.instance;
  }

  async initialize() {
    if (this.initializationPromise) {
      console.log('[UserStore] Initialization already in progress, waiting...');
      return this.initializationPromise;
    }

    console.log('[UserStore] Starting initialization');
    this.initializationPromise = (async () => {
      try {
        console.log('[UserStore] Fetching initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[UserStore] Session error:', error);
          throw error;
        }
        
        console.log('[UserStore] Got session:', session?.user?.id);
        await this.updateUser(session);
        this.setupAuthListener();
      } catch (error) {
        console.error('[UserStore] Initialization error:', error);
        this.user = null;
        this.loading = false;
        await this.notifySubscribers();
      } finally {
        console.log('[UserStore] Initialization complete');
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  private setupAuthListener() {
    if (this.authSubscription) {
      console.log('[UserStore] Auth listener already setup');
      return;
    }

    console.log('[UserStore] Setting up auth state listener');
    this.authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[UserStore] Auth state changed:', event, 'Session:', session?.user?.id);
      try {
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
            await this.updateUser(session);
            break;
          case 'SIGNED_OUT':
            console.log('[UserStore] User signed out');
            this.user = null;
            this.loading = false;
            await this.notifySubscribers();
            break;
        }
      } catch (error) {
        console.error('[UserStore] Auth state change error:', error);
      }
    });
  }

  private async updateUser(session: any) {
    console.log('[UserStore] Updating user from session:', session?.user?.id);
    if (session?.user) {
      this.user = await getUser();
      console.log('[UserStore] User updated:', this.user?.id);
    } else {
      console.log('[UserStore] No session, clearing user');
      this.user = null;
    }
    this.loading = false;
    await this.notifySubscribers();
  }

  private async notifySubscribers() {
    console.log('[UserStore] Notifying subscribers:', this.subscribers.size);
    const promises = Array.from(this.subscribers).map(cb => cb(this.user));
    await Promise.all(promises);
    console.log('[UserStore] Finished notifying subscribers');
  }

  subscribe(callback: Subscriber): () => void {
    console.log('[UserStore] Adding subscriber, total:', this.subscribers.size + 1);
    this.subscribers.add(callback);
    callback(this.user); // Immediate callback with current state
    
    return () => {
      console.log('[UserStore] Removing subscriber, remaining:', this.subscribers.size - 1);
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0 && this.authSubscription) {
        console.log('[UserStore] No more subscribers, cleaning up auth listener');
        this.authSubscription.unsubscribe();
        this.authSubscription = null;
      }
    };
  }

  getUser() {
    return this.user;
  }

  isLoading() {
    return this.loading;
  }
}

export const userStore = UserStore.getInstance(); 