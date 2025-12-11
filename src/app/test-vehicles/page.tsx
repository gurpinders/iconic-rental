async function getVehicles() {
  const res = await fetch('http://localhost:3000/api/vehicles', {
    cache: 'no-store'
  })
  
  if (!res.ok) throw new Error('Failed to fetch vehicles')
  
  return res.json()
}

export default async function TestVehiclesPage() {
  const { vehicles } = await getVehicles()
  
  return (
    <div className="min-h-screen p-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Test Vehicles Page</h1>
        
        {vehicles.length === 0 ? (
          <p className="text-gray-400">No vehicles found. Database is empty.</p>
        ) : (
          <div className="grid gap-6">
            {vehicles.map((vehicle: any) => (
              <div key={vehicle.id} className="border border-white/10 p-6">
                <h2 className="text-2xl font-bold mb-2">{vehicle.name}</h2>
                <p className="text-gray-400">Category: {vehicle.category}</p>
                <p className="text-gray-400">Capacity: {vehicle.capacity}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}