import { prisma } from '@/lib/prisma'

async function getTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: { 
      isApproved: true,
      isFeatured: true 
    },
    orderBy: { date: 'desc' },
    take: 3
  })
  
  return testimonials
}

export default async function Testimonials() {
  const testimonials = await getTestimonials()

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-8 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 tracking-wide">What Our Clients Say</h2>
          <p className="text-gray-400 text-lg">Real experiences from real customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="p-8 rounded-lg border border-white/20 hover:border-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500"
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-white fill-white' : 'text-gray-600'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-300 leading-relaxed mb-6 italic">
                "{testimonial.comment}"
              </p>

              {/* Customer Info */}
              <div>
                <div className="w-12 h-0.5 bg-white mb-4"></div>
                <p className="font-bold text-lg">{testimonial.name}</p>
                {testimonial.service && (
                  <p className="text-gray-400 text-sm">{testimonial.service}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}