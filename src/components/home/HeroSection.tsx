
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"

export const HeroSection = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 mb-12 text-white shadow-lg overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      <div className="relative max-w-2xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
        >
          Book Your Perfect <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100">
            Futsal Court
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl mb-8 text-gray-100"
        >
          Quick and easy booking for the best futsal courts in your area. Join thousands of players today!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="space-x-4"
        >
          <Link to="/courts">
            <Button size="lg" variant="default" className="bg-white text-blue-700 hover:bg-gray-100">
              Find Courts
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              Sign Up Now
            </Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown className="w-6 h-6 animate-bounce text-white/80" />
        </motion.div>
      </div>
    </motion.div>
  )
}
