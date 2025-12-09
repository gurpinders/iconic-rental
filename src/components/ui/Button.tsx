export default function Button({ 
  children, 
  variant = 'primary' 
}: { 
  children: React.ReactNode
  variant?: 'primary' | 'outline'
}) {
  
  const styles = {
    primary: 'bg-white text-black hover:bg-gray-200',
    outline: 'bg-transparent border border-white text-white hover:bg-white hover:text-black'
  }
  
  return (
    <button className={`px-6 py-3 font-medium transition-all ${styles[variant]}`}>
      {children}
    </button>
  )
}