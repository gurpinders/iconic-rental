import Button from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Iconic Limos</h1>
        <p className="text-xl text-gray-400">Luxury transportation in the GTA</p>
        <div className="flex gap-4">
          <Button variant="primary">Request a Quote</Button>
          <Button variant="outline">View Fleet</Button>
        </div>
      </div>
    </div>
  )
}