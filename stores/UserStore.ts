import { supabase, getUser } from '@/lib/supabase';

type Subscriber = (user: any) => void;

class UserStore {
  private static instance: UserStore;
  private user: any = null;
  private loading: boolean = true;
  private subscribers = new Set<Subscriber>();
  private authSubscription: any = null;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore();
    }
    return UserStore.instance;
  }

  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        await this.updateUser(session);
        this.setupAuthListener();
      } catch (error) {
        this.user = null;
        this.loading = false;
        await this.notifySubscribers();
      } finally {
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  private setupAuthListener() {
    if (this.authSubscription) return;

    this.authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
          case 'USER_UPDATED':
            await this.updateUser(session);
            break;
          case 'SIGNED_OUT':
            this.user = null;
            this.loading = false;
            await this.notifySubscribers();
            break;
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  private async updateUser(session: any) {
    if (session?.user) {
      this.user = await getUser();
    } else {
      this.user = null;
    }
    this.loading = false;
    await this.notifySubscribers();
  }

  private async notifySubscribers() {
    const promises = Array.from(this.subscribers).map(cb => cb(this.user));
    await Promise.all(promises);
  }

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    callback(this.user);
    
    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0 && this.authSubscription) {
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