'use server';

import { login, logout } from '@/lib/admin-auth';
import { revalidatePath, redirect } from 'next/navigation';

export async function loginAction(_prev, formData) {
    const password = formData.get('password')?.toString();
    if (!password) return { error: 'Password is required' };
    const ok = await login(password);
    if (!ok) return { error: 'Invalid password' };
    redirect('/admin');
}

export async function logoutAction() {
    await logout();
    revalidatePath('/admin');
    redirect('/admin');
}
