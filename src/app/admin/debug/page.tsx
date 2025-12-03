'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (session) {
      fetch('/api/admin/debug')
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(err => console.error(err))
    }
  }, [session])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Session Debug Info</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Session Status:</h2>
            <p className="text-gray-600">{status}</p>
          </div>

          <div>
            <h2 className="font-semibold">Session Data:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="font-semibold">User Role:</h2>
            <p className="text-lg">
              <span className="font-semibold">Role:</span>{' '}
              <span className={session?.user?.role === 'ADMIN' ? 'text-green-600' : 'text-red-600'}>
                {session?.user?.role || 'NOT SET'}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Expected: ADMIN | Actual: {session?.user?.role || 'undefined'}
            </p>
          </div>

          {userData && (
            <div>
              <h2 className="font-semibold">Database User Data:</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

