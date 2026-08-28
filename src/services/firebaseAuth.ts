import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  serverTimestamp,
  FirebaseUser
} from './firebase';
import { AuthUser, UserProfile, PlanType, BusinessProfile, CompleteStrategy, AdminCustomer } from '../types';

const ADMIN_EMAILS = ['mayragutierrezc04@gmail.com', 'admin@marketia.io', 'mayra@marketia.io'];

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

/**
 * Transforms Firebase User and Firestore data into application AuthUser
 */
export const mapToAuthUser = (user: FirebaseUser, extraRole?: 'admin' | 'client'): AuthUser => {
  const isDefaultAdmin = isAdminEmail(user.email);
  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
    photoURL: user.photoURL || undefined,
    role: isDefaultAdmin || extraRole === 'admin' ? 'admin' : 'client'
  };
};

/**
 * Get or create User Profile in Firestore
 */
export const syncUserProfileInFirestore = async (user: FirebaseUser): Promise<UserProfile> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    const isOwner = isAdminEmail(user.email);

    if (snap.exists()) {
      const data = snap.data();
      const updatedProfile: UserProfile = {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || data.displayName || 'Usuario',
        photoURL: user.photoURL || data.photoURL || '',
        role: isOwner || data.role === 'admin' ? 'admin' : 'client',
        plan: data.plan || 'free',
        billingCycle: data.billingCycle || 'monthly',
        generationsUsed: typeof data.generationsUsed === 'number' ? data.generationsUsed : 0,
        generationsLimit: data.generationsLimit ?? (data.plan === 'pro' ? Infinity : data.plan === 'starter' ? 20 : 3),
        renewalDate: data.renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR'),
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // If user is owner, ensure role is 'admin'
      if (isOwner && data.role !== 'admin') {
        await updateDoc(userRef, { role: 'admin', updatedAt: serverTimestamp() });
      }

      return updatedProfile;
    } else {
      // Create new profile doc
      const newProfile: UserProfile = {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
        photoURL: user.photoURL || '',
        role: isOwner ? 'admin' : 'client',
        plan: isOwner ? 'pro' : 'free',
        billingCycle: 'monthly',
        generationsUsed: 0,
        generationsLimit: isOwner ? Infinity : 3,
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, {
        ...newProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return newProfile;
    }
  } catch (error) {
    console.warn('[Firebase] Could not sync user profile to Firestore (using memory profile):', error);
    const isOwner = isAdminEmail(user.email);
    return {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Usuario',
      photoURL: user.photoURL || '',
      role: isOwner ? 'admin' : 'client',
      plan: isOwner ? 'pro' : 'free',
      billingCycle: 'monthly',
      generationsUsed: 0,
      generationsLimit: isOwner ? Infinity : 3,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

/**
 * Sign in with Google Popup
 */
export const loginWithGoogle = async (): Promise<{ user: FirebaseUser; profile: UserProfile }> => {
  const result = await signInWithPopup(auth, googleProvider);
  const profile = await syncUserProfileInFirestore(result.user);
  return { user: result.user, profile };
};

/**
 * Sign in with Email and Password
 */
export const loginWithEmail = async (email: string, pass: string): Promise<{ user: FirebaseUser; profile: UserProfile }> => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  const profile = await syncUserProfileInFirestore(result.user);
  return { user: result.user, profile };
};

/**
 * Register with Email and Password
 */
export const registerWithEmail = async (
  email: string,
  pass: string,
  displayName?: string
): Promise<{ user: FirebaseUser; profile: UserProfile }> => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  const profile = await syncUserProfileInFirestore(result.user);
  if (displayName) {
    profile.displayName = displayName;
    try {
      await updateDoc(doc(db, 'users', result.user.uid), { displayName });
    } catch {
      // safe fallback
    }
  }
  return { user: result.user, profile };
};

/**
 * Sign out
 */
export const logoutFromFirebase = async (): Promise<void> => {
  await fbSignOut(auth);
};

/**
 * Save user's Business Profile to Firestore
 */
export const saveBusinessToFirestore = async (userId: string, business: BusinessProfile): Promise<void> => {
  try {
    const businessDoc = doc(db, 'businesses', business.id || `biz_${userId}`);
    await setDoc(businessDoc, {
      ...business,
      userId,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firebase] Could not save business to Firestore:', err);
  }
};

/**
 * Load user's Business Profile from Firestore
 */
export const loadBusinessFromFirestore = async (userId: string): Promise<BusinessProfile | null> => {
  try {
    const bizRef = doc(db, 'businesses', `biz_${userId}`);
    const snap = await getDoc(bizRef);
    if (snap.exists()) {
      return snap.data() as BusinessProfile;
    }
  } catch (err) {
    console.warn('[Firebase] Could not load business from Firestore:', err);
  }
  return null;
};

/**
 * Save user's Strategy to Firestore
 */
export const saveStrategyToFirestore = async (userId: string, strategy: CompleteStrategy): Promise<void> => {
  try {
    const stratDoc = doc(db, 'strategies', `strat_${userId}`);
    await setDoc(stratDoc, {
      ...strategy,
      userId,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firebase] Could not save strategy to Firestore:', err);
  }
};

/**
 * Load user's Strategy from Firestore
 */
export const loadStrategyFromFirestore = async (userId: string): Promise<CompleteStrategy | null> => {
  try {
    const stratDoc = doc(db, 'strategies', `strat_${userId}`);
    const snap = await getDoc(stratDoc);
    if (snap.exists()) {
      return snap.data() as CompleteStrategy;
    }
  } catch (err) {
    console.warn('[Firebase] Could not load strategy from Firestore:', err);
  }
  return null;
};

/**
 * Update plan in Firestore
 */
export const updatePlanInFirestore = async (userId: string, plan: PlanType): Promise<void> => {
  try {
    const limit = plan === 'pro' ? Infinity : plan === 'starter' ? 20 : 3;
    await updateDoc(doc(db, 'users', userId), {
      plan,
      generationsLimit: limit === Infinity ? 999999 : limit,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('[Firebase] Could not update plan in Firestore:', err);
  }
};

/**
 * Fetch all registered users for Admin View
 */
export const fetchAllUsersForAdmin = async (): Promise<AdminCustomer[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    const list: AdminCustomer[] = [];
    snapshot.forEach((d) => {
      const u = d.data();
      const plan = (u.plan || 'free') as PlanType;
      const isPro = plan === 'pro';
      const isStarter = plan === 'starter';

      list.push({
        id: d.id,
        name: u.displayName || u.email?.split('@')[0] || 'Cliente',
        email: u.email || 'sin-email@marketia.io',
        businessName: u.businessName || (u.displayName ? `Negocio de ${u.displayName}` : 'Mi Negocio'),
        category: u.category || 'General',
        plan,
        paymentMethod: isPro ? 'stripe' : isStarter ? 'mercadopago' : 'free',
        status: 'active',
        monthlyRevenueUSD: isPro ? 17.5 : isStarter ? 10 : 0,
        monthlyRevenueARS: isPro ? 26250 : isStarter ? 15000 : 0,
        generationsUsed: u.generationsUsed || 0,
        signupDate: u.createdAt ? (typeof u.createdAt === 'string' ? u.createdAt.split('T')[0] : '2026-08-28') : '2026-08-28',
        lastActive: 'Hoy',
        autoRenew: plan !== 'free'
      });
    });
    return list;
  } catch (err) {
    console.warn('[Firebase] Could not fetch all users from Firestore:', err);
    return [];
  }
};

/**
 * Save Global Pricing Config to Firestore
 */
export const savePricingConfigToFirestore = async (config: any): Promise<void> => {
  try {
    const configDoc = doc(db, 'pricing_config', 'global');
    await setDoc(configDoc, {
      ...config,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firebase] Could not save pricing config to Firestore:', err);
  }
};

/**
 * Load Global Pricing Config from Firestore
 */
export const loadPricingConfigFromFirestore = async (): Promise<any | null> => {
  try {
    const configDoc = doc(db, 'pricing_config', 'global');
    const snap = await getDoc(configDoc);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('[Firebase] Could not load pricing config from Firestore:', err);
  }
  return null;
};

