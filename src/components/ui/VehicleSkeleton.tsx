export default function VehicleSkeleton() {
  return (
    <div className="border border-white/20 rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-64 bg-zinc-800"></div>
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Category badge */}
        <div className="h-6 w-24 bg-zinc-800 rounded"></div>
        
        {/* Title */}
        <div className="h-8 w-3/4 bg-zinc-800 rounded"></div>
        
        {/* Capacity */}
        <div className="h-6 w-32 bg-zinc-800 rounded"></div>
        
        {/* Button */}
        <div className="h-12 w-full bg-zinc-800 rounded"></div>
      </div>
    </div>
  );
}