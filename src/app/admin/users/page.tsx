import React from 'react';
export const dynamic = 'force-dynamic';
import { db } from '@/db';
import { users } from '@/db/schema';
import { desc } from 'drizzle-orm';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { updateUser, deleteUser } from '@/lib/actions';
import Link from 'next/link';

export default async function UserManagementPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <span className="inline-block bg-primary-container px-3 py-1 brutal-border mb-4 font-display font-bold text-xs uppercase tracking-widest">
            Identity Registry
          </span>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">Personnel Management</h1>
          <Link href="/admin/dashboard" className="font-display font-bold uppercase text-primary tracking-widest text-sm hover:underline">
            &larr; Return to Dashboard
          </Link>
        </div>
      </div>

      <BrutalCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="p-4">Participant Identity</th>
                <th className="p-4">Institution Data</th>
                <th className="p-4">Terminal Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-on-surface/10">
              {allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-primary-container/5 transition-colors">
                  <td className="p-4 w-1/3">
                    <form action={updateUser} className="space-y-2">
                       <input type="hidden" name="id" value={user.id} />
                       <input 
                         name="name" 
                         defaultValue={user.name} 
                         className="bg-transparent font-black uppercase text-sm w-full outline-none focus:border-b-2 border-primary"
                       />
                       <input 
                         name="phone" 
                         defaultValue={user.phone || ''} 
                         placeholder="PHONE"
                         className="bg-transparent font-mono text-xs w-full outline-none opacity-60 focus:border-b-2 border-primary focus:opacity-100"
                       />
                       <br />
                       <span className="text-[10px] uppercase font-bold bg-primary/20 px-2 rounded-sm">{user.role}</span>
                    </form>
                  </td>
                  <td className="p-4 w-1/3">
                    {/* The form must wrap specific inputs so they are submitted together on Edit */}
                    <form action={updateUser} id={`update-${user.id}`} className="space-y-2">
                       <input type="hidden" name="id" value={user.id} />
                       <input type="hidden" name="name" value={user.name} />
                       <input type="hidden" name="phone" value={user.phone || ''} />
                       
                       <input 
                         name="college" 
                         defaultValue={user.college || ''} 
                         placeholder="COLLEGE UNKNOWN"
                         className="bg-transparent font-bold text-xs uppercase w-full outline-none focus:border-b-2 border-primary"
                       />
                       <input 
                         name="branch" 
                         defaultValue={user.branch || ''} 
                         placeholder="BRANCH UNKNOWN"
                         className="bg-transparent font-bold text-xs opacity-60 uppercase w-full outline-none focus:border-b-2 border-primary focus:opacity-100"
                       />
                    </form>
                  </td>
                  <td className="p-4 flex gap-4 items-center h-full">
...                    {/* Connecting Edit Button to the form in Institution Data to demonstrate functional cross-linking, though normally you wrap all columns in 1 form. In React Server Components tables, we use a single form wrapping the tr if possible, or trigger form elements via form attribute. */}
                    <div className="flex gap-2">
                         <BrutalButton form={`update-${user.id}`} type="submit" variant="secondary" size="sm" className="bg-blue-100 text-blue-800 border-blue-800">
                           Save Edits
                         </BrutalButton>
                         <form action={deleteUser}>
                           <input type="hidden" name="id" value={user.id} />
                           <BrutalButton type="submit" variant="secondary" size="sm" className="bg-red-100 text-red-800 border-red-800">
                             Purge User
                           </BrutalButton>
                         </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BrutalCard>
    </div>
  );
}
